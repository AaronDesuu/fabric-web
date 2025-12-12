import { createClient } from './client';

/**
 * Create a new order in Supabase
 * @param {Object} orderData - Customer and order details
 * @param {Array} cartItems - Array of cart items
 * @returns {Promise<{ orderId: string, error: object }>}
 */
export async function createOrder(orderData, cartItems) {
    const supabase = createClient();

    try {
        // 1. Insert Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_name: orderData.name,
                customer_phone: orderData.whatsapp,
                customer_email: null, // Not collecting email in this form
                customer_address: orderData.address,
                notes: orderData.notes,
                total_amount: orderData.total,
                payment_method: orderData.paymentMethod,
                status: 'pending'
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Prepare Order Items
        const orderItems = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name_en: item.name.en || item.name['en'],
            product_name_id: item.name.id || item.name['id'],
            quantity_meters: item.quantity,
            price_per_meter: item.price,
            subtotal: item.price * item.quantity,
            // Store variant snapshot if variant exists
            variant_snapshot: item.variant ? {
                id: item.variant.id,
                name: item.variant.variant_name,
                value: item.variant.variant_value, // Localized value usually handled in UI, storing raw or fallback here
                value_en: item.variant.variant_value_en, // Assuming these fields exist based on previous tasks
                status: item.variant.stock_meters > 0 ? 'instock' : 'outofstock'
            } : {}
        }));

        // 3. Insert Order Items
        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return { orderId: order.id, error: null };

    } catch (error) {
        console.error('Error creating order:', error);
        return { orderId: null, error };
    }
}
