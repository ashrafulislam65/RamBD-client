import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://felna-tech.com";

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.unicodeconverter.info";
    // 1. Fetch Categories
    let categoryEntries: MetadataRoute.Sitemap = [];
    try {
        const catRes = await fetch(`${apiBaseUrl}/home-menu`);
        const catData = await catRes.json();
        const categories = catData.category || [];
        categoryEntries = categories.map((cat: any) => ({
            url: `${baseUrl}/category/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        }));
    } catch (error) {
        console.error("Sitemap category fetch failed:", error);
    }

    // 2. Fetch Products (Latest, Popular, Top Rated)
    let productEntries: MetadataRoute.Sitemap = [];
    try {
        const [latest, popular, topRated] = await Promise.all([
            fetch(`${apiBaseUrl}/LatestProductList/getAllLatestProducts`).then(res => res.json()),
            fetch(`${apiBaseUrl}/most-popular-product`).then(res => res.json()),
            fetch(`${apiBaseUrl}/top-rated-product`).then(res => res.json()),
        ]);

        const allProducts = [
            ...(latest.products || []),
            ...(popular.populars || []),
            ...(topRated.products || []),
        ];

        // Remove duplicates by slug
        const uniqueProducts = allProducts.reduce((acc: any[], curr: any) => {
            if (!acc.find(p => p.slug === curr.slug)) {
                acc.push(curr);
            }
            return acc;
        }, []);

        productEntries = uniqueProducts.map((prod: any) => ({
            url: `${baseUrl}/product/${prod.slug}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.7,
        }));
    } catch (error) {
        console.error("Sitemap product fetch failed:", error);
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        ...categoryEntries,
        ...productEntries,
    ];
}
