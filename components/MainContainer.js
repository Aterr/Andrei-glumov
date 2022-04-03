import Link from "next/link"
import Head from "next/head";

const MainContainer = ({children, title = 'Main Page'}) => {
    return (
        <>
            <Head>
                <title>{title} | Filter App</title>
                <meta keywords="filter, app, products"></meta>
            </Head>
            <div className="navbar">
                <Link href={'/'}><a className="navbar-link">Main Page</a></Link>
                <Link href={'/products'}><a className="navbar-link">All Products</a></Link>
            </div>
            {children}
        </>
    )
}

export default  MainContainer;