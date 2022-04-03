import MainContainer from "./MainContainer";

const Product = ({title, image, price, tags, colors}) => {
    return (
        <div className="products-item">
            <p className="products-item__title">{title}</p>
            <img src={image} alt={title} className="products-item__image"/>
            <p className="products-item__price">{price}$</p>
            <p className="products-item__price">{tags.join(", ")}</p>
            <p className="products-item__price">{colors}</p>
        </div>
    )
}

export default Product;