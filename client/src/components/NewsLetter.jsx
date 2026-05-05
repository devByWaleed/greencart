

const NewsLetter = () => {
    return (
        <div className="w-full px-2 text-center text-slate-900 py-20 flex flex-col items-center justify-center mt-24 pb-14">
            <p className="text-primary font-medium">Get updated</p>
            <h1 className="max-w-lg font-semibold text-4xl/[44px] mt-2">Subscribe to our newsletter & get the latest news</h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 max-w-md w-full">
                <input
                    type="email"
                    className="flex-1 w-full sm:w-auto border border-slate-600 rounded-full px-4 py-3 bg-transparent outline-none focus:outline focus:outline-primary-dull"
                    placeholder="Enter your email address"
                />
                <button className="bg-primary hover:bg-primary-dull text-white rounded-full px-6 py-3 whitespace-nowrap">
                    Subscribe now
                </button>
            </div>
        </div>
    )
}

export default NewsLetter
