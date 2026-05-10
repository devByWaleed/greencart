import { useState } from "react";
import { assets, getOptimizedImageUrl } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {

    const { currency, addToCart, removeFromCart, navigate, cartItems } = useAppContext()

    // Compute how many full stars to show — rounded to nearest 0.5
    const rating = product.averageRating || 0
    const reviewCount = product.reviewCount || 0


    return product && (
        <section onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }} className="border      border-gray-500/20 rounded-md max-w-54 md:px-4 px-3 py-2">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img loading="lazy" className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={getOptimizedImageUrl(product.image[0], 200)} alt={product.name}
                    width={144}
                    height={144}
                />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>


                {/* Real Time Rating */}
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (

                        <img key={i} src={i < Math.round(rating) ? assets.star_icon : assets.star_dull_icon} alt="Rating Stars" className="md:w-3.5 w-3" />

                    ))}
                    <p>{reviewCount > 0 ? `(${reviewCount})` : "(No reviews)"}</p>
                </div>


                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-primary">
                        {currency}{product.offerPrice}{" "} <span className="text-gray-500 md:text-sm text-xs line-through">${product.price}</span>
                    </p>

                    <div onClick={(e) => { e.stopPropagation() }} className="text-primary">
                        {!cartItems[product._id] ? (
                            <button className="flex items-center justify-center gap-1 cursor-pointer text-primary-dark bg-primary/10 border border-primary/40 md:w-20 w-16 h-8.5 rounded font-medium"
                                onClick={() => addToCart(product._id)}
                                style={{ color: '#2d9e6b' }}>
                                <img src={assets.cart_icon} alt="Cart Icon" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-8.5 bg-primary/25 rounded select-none">
                                <button onClick={() => { removeFromCart(product._id) }} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => addToCart(product._id)} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductCard