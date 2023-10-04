import { listProducts } from "@/api/product/listProducts";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OffsetPagination from "@/components/OffsetPagination";
import SearchInput from "@/components/SearchInput";
import Typography from "@/components/Typography";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { Link } from "preact-router";
import { useEffect } from "preact/hooks";

const SearchResult = () => {
  const products = useSignal<PricedProduct[]>([]);
  const isLoading = useSignal<boolean | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(20);
  const offset = useSignal<number>(0);

  const currentUrl = new URL(window.location.href);
  const searchQuery = currentUrl.searchParams.get("q");
  const searchTerm = useSignal<string | undefined>(searchQuery);

  const getProducts = async () => {
    isLoading.value = true;

    try {
      const productRes = await listProducts({
        q: searchTerm.value ? searchTerm.value : undefined,
        limit: limit.value,
        offset: offset.value,
      });
      if (!productRes?.products?.length && productRes?.count) {
        offset.value = 0;
      }
      products.value = productRes?.products;
      count.value = productRes?.count;
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    if (searchTerm.value) {
      const getData = setTimeout(() => {
        getProducts();
      }, 500);
      return () => clearTimeout(getData);
    }

    getProducts();
  }, [offset.value, searchTerm.value]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Search Products</Typography>
      </div>
      <SearchInput searchTerm={searchTerm} isSearchSort={false} />

      <div className="text-center my-2 w-full mb-20">
        {searchTerm.value ? (
          <Typography size="body2/normal" className="mb-4 text-start">
            Search Result for '{searchTerm.value}'
          </Typography>
        ) : null}
        {!isLoading.value ? (
          products.value?.length ? (
            <div className=" w-full flex flex-col  my-2 gap-4">
              {products.value.map((product) => (
                <div className="w-full flex justify-between items-center relative pb-2 border-b last:border-none">
                  <Link
                    href={`/product/${product?.id}`}
                    className="flex items-center gap-2 w-full "
                  >
                    <img
                      src={product.thumbnail ?? "/images/placeholderImg.svg"}
                      alt={product.title}
                      className="w-12 h-12 object-cover"
                    />
                    <Typography
                      size="body1/normal"
                      className="text-start truncate "
                    >
                      {product.title}
                    </Typography>
                  </Link>
                </div>
              ))}
              <OffsetPagination limit={limit} offset={offset} count={count} />
            </div>
          ) : !products.value?.length && count.value ? (
            <div className="w-full h-40 ">
              <Loading loadingText="loading" />
            </div>
          ) : isLoading.value === undefined ? null : (
            <Typography className="w-full">Search result not found</Typography>
          )
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default SearchResult;
