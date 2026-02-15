
import Box from "@component/Box";
import SearchResult from "./SearchResult";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  discount: number;
  thumbnail: string;
  images: string[];
  rating: number;
  categories: any[];
  status?: string;
}

async function getProducts(slug: string): Promise<Product[]> {
  try {
    const res = await fetch(`https://admin.felnatech.com/products/searchpro?search=${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const json = await res.json();

    // Check if products exists and has data array
    const productData = json.products?.data || [];

    return productData.map((item: any) => ({
      id: item.id?.toString(),
      slug: item.pro_slug || '',
      title: item.pro_title || '',
      price: Number(item.pro_price || 0),
      discount: Number(item.pro_discount || 0),
      thumbnail: item.images && item.images.length > 0 ? `https://admin.felnatech.com/storage/app/public/products/${item.images[0].img_name}` : '/assets/images/products/macbook.png', // Fallback image
      images: item.images?.map((img: any) => `https://admin.felnatech.com/storage/app/public/products/${img.img_name}`) || [],
      rating: 4, // Default rating
      categories: [],
      status: item.pro_status?.toString()
    }));
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

export default async function ProductSearchResult({ params }: { params: { slug: string } }) {
  const products = await getProducts(params.slug);

  return (
    <Box pt="20px">
      <SearchResult sortOptions={sortOptions} products={products} />
    </Box>
  );
}

const sortOptions = [
  { label: "Relevance", value: "Relevance" },
  { label: "Date", value: "Date" },
  { label: "Price Low to High", value: "Price Low to High" },
  { label: "Price High to Low", value: "Price High to Low" }
];

