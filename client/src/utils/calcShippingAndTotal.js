
export default function calculateTotal(orderQty, priceEa) {
    // $20 base rate and $0.25 per item
    const shippingCost = 20 + (.25 * orderQty);

    // Calculate the total cost including shipping
    const totalCost = (priceEa * orderQty) + shippingCost;
    const ship = shippingCost
    const total = totalCost
    return {
        ship,
        total,
    };
}
