
export default function Home(){
    return (
        <>
            <h1>Home Page</h1>
            <button type='button' className="bg-blue-500 text-white shadow-lg shadow-black/30 flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer" onClick={()=>{location.href='/signin'}} >Login</button>
        </>
    )
}