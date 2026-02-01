"use client";

import { useEffect, useState, use } from "react";
import Box from "@component/Box";
import api from "@utils/__api__/orders";
import Order from "@models/order.model";
import Invoice from "@component/invoice/Invoice";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orders = await api.getOrders();
                const found = orders.find(o => o.id.includes(id) || id === "latest");
                if (found) {
                    setOrder(found);
                } else if (orders.length > 0) {
                    setOrder(orders[0]); // Fallback to first
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <Box textAlign="center" p="40px">Loading Invoice...</Box>;
    if (!order) return <Box textAlign="center" p="40px">Invoice not found.</Box>;

    return (
        <Box py="20px">
            <Invoice order={order} />
        </Box>
    );
}
