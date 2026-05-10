import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {
    const { products, searchQuery } = useAppContext()
    const [filteredProducts, setFilteredProducts] = useState([])

    useEffect(() => {
        if (searchQuery.length > 0) {
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        } else {
            setFilteredProducts(products)
        }
    }, [products, searchQuery])

    const inStockFiltered = filteredProducts.filter((product) => product.inStock)

    return (
        <section className='mt-16 flex flex-col'>

            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium uppercase'>All products</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            {/* No results state */}
            {inStockFiltered.length === 0 && searchQuery.length > 0 ? (
                <div className='flex flex-col items-center justify-center py-24 text-center'>

                    {/* SVG illustration — no external dependency needed */}
                    <svg
                        className="w-32 h-32 mb-6 text-gray-200"
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Magnifying glass body */}
                        <circle cx="85" cy="85" r="45" stroke="currentColor" strokeWidth="10" />
                        {/* Magnifying glass handle */}
                        <line x1="118" y1="118" x2="160" y2="160" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                        {/* X inside the glass */}
                        <line x1="70" y1="70" x2="100" y2="100" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                        <line x1="100" y1="70" x2="70" y2="100" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    </svg>

                    <p className='text-xl font-medium text-gray-700'>
                        No results for{" "}
                        <span className='text-primary'>"{searchQuery}"</span>
                    </p>
                    <p className='text-gray-400 mt-2 text-sm max-w-xs'>
                        Try checking your spelling or searching for something more general.
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                    {inStockFiltered.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            )}

        </section>
    )
}

export default AllProducts