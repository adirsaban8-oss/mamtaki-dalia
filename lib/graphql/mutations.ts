import { gql } from '@apollo/client';

/**
 * WPGraphQL for WooCommerce checkout mutation.
 *
 * The shop is set up to accept Cash-on-Delivery (`cod`) as the default
 * payment method out of the box. To add credit-card support (Meshulam /
 * PayPlus), install the gateway plugin in WordPress and pass its method
 * ID here (e.g. `meshulam_payment_gateway`). The mutation will then
 * return a `redirect` URL to hand the customer over to the payment
 * provider's hosted page.
 *
 * `lineItems` accepts product database IDs (the WooCommerce post ID).
 * Our `Product.id` looks like `wp_16`; the checkout form strips the
 * `wp_` prefix before sending.
 */
export const CHECKOUT_MUTATION = gql`
  mutation CreateOrder($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        databaseId
        orderNumber
        status
        total
      }
      redirect
      result
    }
  }
`;
