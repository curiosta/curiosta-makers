import SearchInput from "@components/SearchInput";
import TopNavbar from "@components/Navbar/TopNavbar";
import Typography from "@components/Typography";
import Button from "@components/Button";
import print_icon from "@assets/3d_print.svg";
import leser_icon from "@assets/laser_cut.svg";
import BottomNavbar from "@components/Navbar/BottomNavbar";
import { useSignal } from "@preact/signals";
import { categoriesList } from "@/api/product/categoriesList";
import { useEffect } from "preact/hooks";
import { ProductCategory } from "@medusajs/medusa";
import Loading from "@/components/Loading";
import OffsetPagination from "@components/OffsetPagination";
import ViewCartLayer from "@/components/ViewCartLayer";

const Request = () => {
  const categories = useSignal<ProductCategory[]>([]);
  const isLoading = useSignal<boolean>(false);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(9);
  const offset = useSignal<number>(0);
  const searchTerm = useSignal<string | undefined>(undefined);

  const getCategories = async () => {
    isLoading.value = true;
    try {
      const categoryRes = await categoriesList({
        q: searchTerm.value ? searchTerm.value : undefined,
        limit: limit.value,
        offset: offset.value,
      });
      if (!categoryRes?.product_categories?.length && categoryRes?.count) {
        offset.value = 0;
      }
      categories.value = categoryRes?.product_categories;
      count.value = categoryRes?.count;
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    if (searchTerm.value) {
      const getData = setTimeout(() => {
        getCategories();
      }, 500);
      return () => clearTimeout(getData);
    }
    getCategories();
  }, [offset.value, searchTerm.value]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Request Items</Typography>
      </div>

      <div className="w-full mb-12 max-w-2xl">
        <SearchInput searchTerm={searchTerm} isSearchSort={false} />

        <div className="text-center my-2 w-full mb-20">
          <Typography size="h6/normal">Choose Category</Typography>

          {!isLoading.value ? (
            categories.value?.length ? (
              <div className="w-full">
                <div className="grid grid-cols-3 my-2 items-start gap-4 sm:grid-cols-5">
                  {categories.value.map((category, index) => (
                    <Button
                      key={index}
                      link={`/create-requests/${category.id}`}
                      variant="icon"
                      className={"flex-col items-center gap-2 !p-0"}
                    >
                      <div className="border border-black rounded-full bg-secondray shadow-lg">
                        <img src={leser_icon} alt="icon" className="p-3" />
                      </div>
                      <Typography size="body2/normal">
                        {category.name}
                      </Typography>
                    </Button>
                  ))}
                </div>
                <OffsetPagination limit={limit} offset={offset} count={count} />
              </div>
            ) : !categories.value?.length && count.value ? (
              <div className="w-full h-40 ">
                <Loading loadingText="loading" />
              </div>
            ) : (
              <Typography className="mt-8">No category found</Typography>
            )
          ) : (
            <div className="h-40">
              <Loading loadingText="loading" />
            </div>
          )}
          <ViewCartLayer actionText="View Cart" actionLink="/cart" />
        </div>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Request;
