import {useState, useEffect} from 'react';
import MainContainer from "../components/MainContainer";
import Product from "../components/Product";

const data = require('../miista-export.json');

const productList = data.data.allContentfulProductPage.edges;

const Products = () => {
    const [priceInputValueFrom, setPriceInputValueFrom] = useState(0)
    const [priceInputValueTo, setPriceInputValueTo] = useState(0)

    const [unchunkedArr, setUnchunkedArr] = useState(productList)
    const [paginatedContent, setPaginatedContent] = useState([[]])

    const [selectedPage, setSelectedPage] = useState(0)

    const [colors, setColors] = useState([])
    const [tags, setTags] = useState([])

    const [selectedColor, setSelectedColor] = useState([])
    const [selectedTag, setSelectedTag] = useState([])



    useEffect(() => {
        getAllColorsAndTags();
        setUnchunkedArr(productList);
    }, []);

    const chunkArr = (arr, size) => {
        let res = [];

        for (let i = 0; i < arr.length; i += size) {
            const chunk = arr.slice(i, i + size);
            res.push(chunk);
        }
        return res;
    }

    const unChunkArr = () => {
        let res = [];

        paginatedContent.forEach(page => {
            if(page) {
                page.forEach(product => {
                    res.push(product);
                })
            }
        });

        return res;
    }

    const getAllColorsAndTags = () => {
        let colorFilters = [];
        let tagFilters = [];

        let res = unchunkedArr.forEach(item => {
            //Tags
            if (!item.node.categoryTags) {
                item.node.categoryTags = [];
            }

            item.node.categoryTags.forEach(tag => {
                if(!tagFilters.includes(tag.trim())) {
                    tagFilters.push(tag.trim());
                }
            })

            //Colors
            if (!item.node.colorFamily) {
                item.node.colorFamily = [];
            }

            item.node.colorFamily.forEach(color => {
                if(!colorFilters.includes(color.name.trim())) {
                    colorFilters.push(color.name.trim());
                }
            })
        })

        setColors([...new Set(colorFilters)]);
        setTags([...new Set(tagFilters)]);

        setUnchunkedArr(res);
        setPaginatedContent(chunkArr(unchunkedArr, 9));
    }

    const filterBtn = () => {
        let res = productList.filter(x => {
            const productPrice = parseInt(x.node.shopifyProductEu.variants.edges[0].node.price);

            if(priceInputValueFrom && priceInputValueTo){
                return (productPrice > priceInputValueFrom && productPrice < priceInputValueTo)
            } else if (!priceInputValueFrom && priceInputValueTo) {
                return (productPrice > 0 && productPrice < priceInputValueTo)
            } else if (priceInputValueFrom && !priceInputValueTo) {
                return (productPrice > priceInputValueFrom && productPrice < 99999)
            } else if (priceInputValueFrom == 0 && priceInputValueTo == 0) {
                return x;
            } else {
                return x;
            }
        })
            .filter(x => {
                if(selectedColor && selectedColor.length == 0 || x.node.colorFamily.map(color => color.name).some(el => selectedColor.includes(el))) {
                    return x;
                }
            })
            .filter(x => {
                if(selectedTag && selectedTag.length == 0 || x.node.categoryTags.some(el => selectedTag.includes(el))) {
                    return x;
                }
            })

        setPaginatedContent(chunkArr(res, 9));
        setUnchunkedArr(unChunkArr());
        setSelectedPage(0);
    }

    const selectColors = (e) => {
        const options = e.target.options;
        var value = [];

        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setSelectedColor(value);
    }

    const selectTags = (e) => {
        const options = e.target.options;
        var value = [];

        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setSelectedTag(value);
    }

    return (
        <MainContainer title="All Products">
            <div className="wrapper">
                <div className="filter-side">
                    <p className="filter-side_title">Filter:</p>
                    <div className="filter-side_by-price filter">
                        <p className="filter-title">By Price</p>
                        <form>
                            <input placeholder="from" value={priceInputValueFrom}
                                   onChange={(e) => setPriceInputValueFrom(e.target.value)} className="input by-price-input"/>
                            <input placeholder="to" value={priceInputValueTo}
                                   onChange={(e) => setPriceInputValueTo(e.target.value)} className="input by-price-input"/>
                        </form>
                    </div>
                    <div className="filter-side_by-color filter">
                        <p className="filter-title">By Color</p>
                        <select multiple value={selectedColor} className="select" onChange={selectColors}>
                            <option value="Default" disabled>Select a color</option>
                            {colors.sort().map((color, i)=> (
                                <option key={i} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-side_by-tags filter">
                        <p className="filter-title">By Tags</p>
                        <select multiple value={selectedTag} className="select" onChange={selectTags}>
                            <option value="Default" disabled>Select a tag</option>
                            {tags.sort().map((tag, i)=> (
                                <option key={i} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>
                    <button type="button" className="btn"
                            onClick={filterBtn}>Filter
                    </button>
                </div>
                <div className="products">
                    {
                        paginatedContent.length ?
                            paginatedContent[selectedPage].map((product, i) => (
                                <Product
                                    key={i}
                                    title={product.node.name}
                                    image={product.node.thumbnailImage.file.url}
                                    tags={product.node.categoryTags}
                                    colors={product.node.colorFamily.map(x => x.name)}
                                    price={product.node.shopifyProductEu.variants.edges[0].node.price}
                                />
                            ))
                            :
                            <span>Not results</span>

                    }
                </div>

                <div className="pagination">
                    {
                        paginatedContent.map((i, p) =>
                            <span
                                key={p}
                                className={`pagination-item ${ p == selectedPage ? "active" : "" } `}
                                onClick={() => setSelectedPage(p)}>
                                {p + 1}
                            </span>
                        )
                    }
                </div>

            </div>
        </MainContainer>
    )
}

export default Products;

// export async function getStaticProps(context) {
//     const response = await fetch('../miista-export.json')
//     const products = await response.json()
//
//     return {
//         props: {products}, // will be passed to the page component as props
//     }
// }


// export async function getStaticProps() {
//     const res = await fetch('../miista-export.json')
//     const posts = await res.json()
//
//     return {
//         props: {
//             productList,
//         }
//     }
// }