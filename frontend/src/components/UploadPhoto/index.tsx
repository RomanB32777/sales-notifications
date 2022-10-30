import React from "react";
import { Upload } from "antd";
import type {
  RcFile,
  UploadFile,
  UploadChangeParam,
} from "antd/es/upload/interface";

interface IUploadComponent {
  fileList?: UploadFile[];
  onChange: (info: UploadChangeParam<UploadFile<any>>) => void;
}

const UploadPhoto = ({ onChange, fileList }: IUploadComponent) => {
  const onPreview = async (file: UploadFile) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve((reader.result as string) || "");
      });
    }
    if (src) {
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      (imgWindow as Window).document.write(image.outerHTML);
    }
  };
  return (
    <Upload
      fileList={fileList}
      beforeUpload={() => false}
      listType="picture-card"
      maxCount={1}
      onPreview={onPreview}
      accept=".jpg, .jpeg, .png"
      onChange={onChange}
    >
      Выбрать фото
    </Upload>
  );
};

export default UploadPhoto;
