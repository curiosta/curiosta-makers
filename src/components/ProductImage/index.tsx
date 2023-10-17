import { useSignal } from "@preact/signals";
import Button from "../Button";

interface Props {
  productImages?: {
    id: string;
    url: string;
  }[];
  productTitle?: string;
  prouductThumbnail: string;
}

const ProductImage = ({
  productImages,
  productTitle,
  prouductThumbnail,
}: Props) => {
  const activeIndex = useSignal<number | null>(null);

  return (
    // Image gallery
    <div class="flex flex-col-reverse w-full">
      {/* Image selector */}
      {productImages?.length ? (
        <div class="mx-auto mt-6 w-full sm:w-3/4">
          <div
            class="grid grid-cols-4 gap-6 sm:grid-cols-5"
            aria-orientation="horizontal"
            role="tablist"
          >
            {productImages.map((image, index) => (
              <Button
                key={image.id}
                id="tabs-1-tab-1"
                aria-controls="tabs-1-panel-1"
                role="tab"
                type="button"
                variant="icon"
                className="relative"
                onClick={() => (activeIndex.value = index)}
              >
                <span class="sr-only"> Angled view</span>
                <img
                  src={image.url ?? "/images/placeholderImg.svg"}
                  alt={productTitle}
                  class="object-cover object-center w-10/12"
                />
                <span
                  class={`${
                    activeIndex.value === index ? "ring" : "ring-transparent"
                  }  pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2`}
                  aria-hidden="true"
                />
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <div class="aspect-h-1 aspect-w-1 w-full">
        {/* <!-- Tab panel, show/hide based on tab state. --> */}
        <div
          id="tabs-1-panel-1"
          aria-labelledby="tabs-1-tab-1"
          role="tabpanel"
          tabIndex={activeIndex.value}
          class="flex justify-center items-center"
        >
          {activeIndex.value !== null ? (
            <img
              src={
                productImages?.[activeIndex.value]?.url ??
                "/images/placeholderImg.svg"
              }
              alt={productTitle}
              class="w-10/12 object-cover object-center sm:rounded-lg sm:w-1/3"
            />
          ) : (
            <img
              src={prouductThumbnail ?? "/images/placeholderImg.svg"}
              alt={productTitle}
              class="w-10/12 object-cover object-center sm:rounded-lg sm:w-1/3"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
