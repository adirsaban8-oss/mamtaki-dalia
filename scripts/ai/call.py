"""Single gateway for every paid AI call in the redesign.

    from call import image_edit
    image_edit(purpose='pull frame 1', section='images', src='in.png', out='out.png', prompt='...', size='1536x1024')

Before a call it takes a conservative *maximum* cost from the price table and
refuses (raises BudgetError) if the running total plus that maximum would pass
the section cap or the $10 project cap. After the call it records the actual
cost (from the usage the API returns, at list prices) in
docs/redesign/ai-costs.csv. No retries. The API key is read from the user's
environment and never printed.

Prices: https://developers.openai.com/api/docs/guides/image-generation (checked 2026-11-16).
gpt-image-2.6 lists $30 / 1M output tokens; its input prices are not listed, so the
gpt-image-2.5 input prices ($8 image, $5 text per 1M) are used.
"""
import base64, csv, datetime, io, json, os, sys, winreg
import requests
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
LOG = os.path.join(ROOT, 'docs', 'redesign', 'ai-costs.csv')

PROJECT_CAP = 10.00
SECTION_CAPS = {'video': 6.00, 'images': 2.50, 'reserve': 1.50, 'pre-budget': 99}

PRICE = {  # USD per 1M tokens
    'gpt-image-2.6-sunburst': {'out': 30.0, 'in_image': 8.0, 'in_text': 5.0},
}
# Upper bound per call: the largest output-token count the docs list for high quality
# (6240) plus a 2,000-token image input and a 600-token prompt.
MAX_TOKENS = {'out': 6240, 'in_image': 2000, 'in_text': 600}


class BudgetError(RuntimeError):
    pass


def _key():
    k = os.environ.get('OPENAI_API_KEY')
    if k:
        return k
    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, 'Environment') as h:
        return winreg.QueryValueEx(h, 'OPENAI_API_KEY')[0]


def _rows():
    if not os.path.exists(LOG):
        return []
    with open(LOG, encoding='utf-8', newline='') as f:
        return list(csv.DictReader(f))


def spent(section=None):
    return round(sum(float(r['cost_usd']) for r in _rows() if section is None or r['section'] == section), 4)


def _cost(model, tin_image, tin_text, tout):
    p = PRICE[model]
    return (tout * p['out'] + tin_image * p['in_image'] + tin_text * p['in_text']) / 1e6


def _log(model, section, purpose, estimate, actual, note=''):
    new = not os.path.exists(LOG)
    total = spent() + actual
    with open(LOG, 'a', encoding='utf-8', newline='') as f:
        w = csv.writer(f)
        if new:
            w.writerow(['date', 'model', 'section', 'purpose', 'max_estimate_usd', 'cost_usd', 'cumulative_usd', 'note'])
        w.writerow([datetime.datetime.now().isoformat(timespec='seconds'), model, section, purpose,
                    f'{estimate:.4f}', f'{actual:.4f}', f'{total:.4f}', note])


def check(section, estimate):
    """Raise unless `estimate` fits under both the section cap and the project cap."""
    if section not in SECTION_CAPS:
        raise BudgetError(f'unknown section {section!r}')
    if spent() + estimate > PROJECT_CAP:
        raise BudgetError(f'project cap: spent ${spent():.2f} + max ${estimate:.2f} > ${PROJECT_CAP:.2f}')
    if spent(section) + estimate > SECTION_CAPS[section]:
        raise BudgetError(f'{section} cap: spent ${spent(section):.2f} + max ${estimate:.2f} > ${SECTION_CAPS[section]:.2f}')


def image_edit(*, purpose, section, src, out, prompt, size='1536x1024', quality='high', model='gpt-image-2.6-sunburst'):
    estimate = _cost(model, MAX_TOKENS['in_image'], MAX_TOKENS['in_text'], MAX_TOKENS['out'])
    check(section, estimate)
    im = Image.open(src).convert('RGB')
    if max(im.size) < 1024:
        s = 1024 / max(im.size)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'PNG'); buf.seek(0)
    r = requests.post('https://api.openai.com/v1/images/edits', headers={'Authorization': 'Bearer ' + _key()},
                      data={'model': model, 'prompt': prompt, 'size': size, 'quality': quality, 'n': '1'},
                      files={'image': ('ref.png', buf, 'image/png')}, timeout=600)
    if r.status_code != 200:
        # A rejected call is not billed for output; log it at zero so the attempt is visible.
        _log(model, section, purpose, estimate, 0.0, f'HTTP {r.status_code}')
        raise RuntimeError(f'{r.status_code}: {r.text[:300]}')
    j = r.json()
    u = j.get('usage') or {}
    d = u.get('input_tokens_details') or {}
    actual = _cost(model, d.get('image_tokens', 0), d.get('text_tokens', 0), u.get('output_tokens', 0)) if u else estimate
    data = j['data'][0]
    raw = base64.b64decode(data['b64_json']) if data.get('b64_json') else requests.get(data['url'], timeout=120).content
    with open(out, 'wb') as f:
        f.write(raw)
    _log(model, section, purpose, estimate, actual, '' if u else 'no usage returned; logged at max estimate')
    return actual


def video(**_):
    raise BudgetError('video pricing not configured: read the official price per second first, then add it here')


if __name__ == '__main__':
    print(json.dumps({'spent': spent(), 'by_section': {s: spent(s) for s in SECTION_CAPS}, 'cap': PROJECT_CAP}, indent=1))
