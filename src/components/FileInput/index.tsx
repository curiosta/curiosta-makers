import Typography from "@components/Typography";
import { Signal } from "@preact/signals";
import { useId } from "preact/hooks";

type TFileInput = {
  selectedFile: Signal<File>;
  acceptFileType: string;
};

const FileInput = ({ selectedFile, acceptFileType }: TFileInput) => {
  const id = useId();
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-4 border border-dashed border-black bg-primary-600/20 rounded-2xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="41"
        height="52"
        viewBox="0 0 41 52"
        fill="none"
      >
        <path
          d="M25.625 0H5.125C2.30625 0 0.0256256 2.30625 0.0256256 5.125L0 46.125C0 48.9437 2.28062 51.25 5.09937 51.25H35.875C38.6937 51.25 41 48.9437 41 46.125V15.375L25.625 0ZM35.875 46.125H5.125V5.125H23.0625V17.9375H35.875V46.125ZM10.25 33.3381L13.8631 36.9513L17.9375 32.9025V43.5625H23.0625V32.9025L27.1369 36.9769L30.75 33.3381L20.5256 23.0625L10.25 33.3381Z"
          fill="#727272"
        />
      </svg>
      <Typography>Upload your file here</Typography>
      <label for={id} className="font-semibold underline">
        Browse
      </label>
      {selectedFile.value ? (
        <Typography className="break-all">
          {selectedFile.value?.name}
        </Typography>
      ) : null}
      <input
        type="file"
        name="file"
        id={id}
        className="sr-only"
        accept={acceptFileType}
        onChange={(e) => {
          selectedFile.value = e.currentTarget.files[0];
        }}
        onClick={(e) => (e.currentTarget.value = null)}
      />
    </div>
  );
};

export default FileInput;
