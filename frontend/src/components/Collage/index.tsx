import "./style.scss";

export interface ICollageImage {
  src: string;
  alt: string;
  key?: number;
}

const Collage = ({ images }: { images: ICollageImage[] }) => {
  return (
    <div className={`collage layout-${images.length}`}>
      {images.map(({ src, alt, key }) => (
        <img src={src} alt={alt} key={key || alt} />
      ))}
    </div>
  );
};

export default Collage;
