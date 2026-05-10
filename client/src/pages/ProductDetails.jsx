import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets, getOptimizedImageUrl } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const ProductDetails = () => {

    const { products, navigate, currency, addToCart, user, axios } = useAppContext()
    const { id } = useParams()

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    // Review states
    const [reviews, setReviews] = useState([])
    const [userReviewStatus, setUserReviewStatus] = useState({
        hasOrdered: false,
        existingReview: null
    })
    const [selectedStars, setSelectedStars] = useState(0)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const product = products.find((item) => item._id === id)

    // Fetch all reviews for this product
    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/review/${id}`)
            if (data.success) {
                setReviews(data.reviews)
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error.message)
        }
    }

    // Check if logged-in user can review this product
    const checkUserReviewStatus = async () => {
        if (!user) return
        try {
            const { data } = await axios.get(`/api/review/check/${id}`)
            if (data.success) {
                setUserReviewStatus({
                    hasOrdered: data.hasOrdered,
                    existingReview: data.existingReview
                })
            }
        } catch (error) {
            console.error("Failed to check review status:", error.message)
        }
    }

    const submitReview = async (e) => {
        e.preventDefault()

        if (selectedStars === 0) {
            return toast.error("Please select a star rating")
        }
        if (comment.trim().length < 10) {
            return toast.error("Comment must be at least 10 characters")
        }

        setSubmitting(true)
        try {
            const { data } = await axios.post("/api/review/add", {
                productID: id,
                stars: selectedStars,
                comment: comment.trim()
            })

            if (data.success) {
                toast.success(data.message)
                setComment("")
                setSelectedStars(0)
                // Refresh reviews and status
                await fetchReviews()
                await checkUserReviewStatus()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        // if (products.length > 0 && product) {
        if (products.length > 0) {
            let productsCopy = products.slice()
            productsCopy = productsCopy.filter(
                (item) =>
                    product.category === item.category && item._id !== product._id
            )
            setRelatedProducts(productsCopy.slice(0, 5))
        }
    }, [id, products])


    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null)
    }, [id, products])

    // Fetch reviews and check user status whenever product id changes
    useEffect(() => {
        fetchReviews()
        checkUserReviewStatus()
    }, [id, user])


    const renderStars = (count) => (
        Array(5).fill('').map((_, i) => (
            <img
                key={i}
                src={i < Math.round(count) ? assets.star_icon : assets.star_dull_icon}
                alt="star"
                className="w-4"
            />
        ))
    )


    return product && (
        <section className="mt-12">
            <p>
                <Link to={"/"}>Home</Link> /
                <Link to={"/products"}> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={getOptimizedImageUrl(image, 100)} alt={`Thumbnail ${index + 1}`}
                                    width={96}
                                    height={96}
                                    loading="lazy"
                                    fetchPriority="high"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={getOptimizedImageUrl(thumbnail, 500)} alt="Selected product" width={400} height={400}
                            className="w-full h-full object-cover" fetchPriority="high" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    {/* Real average rating display */}
                    <div className="flex items-center gap-0.5 mt-1">
                        {renderStars(product.averageRating || 0)}

                        <p className="text-base ml-1 text-gray-500">
                            {product.averageRating > 0
                                ? `${product.averageRating} (${product.reviewCount} ${product.reviewCount === 1 ? "review" : "reviews"})`
                                : "No reviews yet"
                            }
                        </p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency} {product.price}</p>
                        <p className="text-2xl font-medium">MRP: {currency} {product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={() => addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button onClick={() => { addToCart(product._id); navigate("/cart") }} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>


            {/* ---------- Reviews Section ---------- */}
            <div className="mt-16" id="reviews">
                <div className="flex flex-col items-start w-max mb-6">
                    <p className="text-2xl font-medium">Customer Reviews</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-1"></div>
                </div>

                {/* Review Form — 3 possible states */}
                {!user ? (
                    // Not logged in
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-center">
                        <p className="text-gray-500 mb-3">Please log in to write a review</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-6 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dull transition">
                            Login to Review
                        </button>
                    </div>

                ) : userReviewStatus.existingReview ? (
                    // Already reviewed — show their review
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                        <p className="text-sm font-medium text-primary mb-2">Your Review</p>
                        <div className="flex items-center gap-1 mb-2">
                            {renderStars(userReviewStatus.existingReview.stars)}
                        </div>
                        <p className="text-gray-600">{userReviewStatus.existingReview.comment}</p>
                    </div>

                ) : userReviewStatus.hasOrdered ? (
                    // Ordered but not reviewed — show the form
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                        <p className="text-base font-medium mb-4">Write a Review</p>

                        {/* Interactive star selector */}
                        <div className="flex items-center gap-1 mb-4">
                            {Array(5).fill('').map((_, i) => (
                                <img
                                    key={i}
                                    src={i < (hoveredStar || selectedStars)
                                        ? assets.star_icon
                                        : assets.star_dull_icon
                                    }
                                    alt="star"
                                    className="w-8 cursor-pointer transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoveredStar(i + 1)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    onClick={() => setSelectedStars(i + 1)}
                                />
                            ))}
                            <span className="ml-2 text-sm text-gray-400">
                                {hoveredStar || selectedStars
                                    ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hoveredStar || selectedStars]
                                    : "Select rating"
                                }
                            </span>
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this product (min. 10 characters)"
                            rows={4}
                            className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-primary transition resize-none text-sm text-gray-700"
                        />

                        <button
                            onClick={submitReview}
                            disabled={submitting}
                            className="mt-3 px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dull transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>

                ) : (
                    // Logged in but hasn't ordered
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Only customers who have purchased this product can leave a review.
                        </p>
                    </div>
                )}


                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <p className="text-gray-400 text-sm py-6 text-center">
                        No reviews yet. Be the first to review this product!
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {reviews.map((review, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {review.userID?.name || "Anonymous"}
                                        </p>
                                        <div className="flex items-center gap-0.5 mt-0.5">
                                            {renderStars(review.stars)}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </p>
                                </div>
                                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* ---------- Related Products ---------- */}

            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                    {relatedProducts.filter((product) => product.inStock).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
                <button onClick={() => { navigate("/products"); scrollTo(0, 0) }} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary-dark hover:bg-primary/10 transition">See More</button>
            </div>

        </section>
    );
};

export default ProductDetails
