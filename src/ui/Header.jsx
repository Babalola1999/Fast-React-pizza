import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

function Header() {
  return (
    
      <header className="px-4 py-4 bg-yellow-500 uppercase border-b
       border-stone-200 flex items-center font-sans justify-between
        sm:px-6">
      
      <Link to="/" className="uppercase tracking-widest" >Fast React Pizza Co.</Link>
      <SearchOrder/>
      <Username/>
      </header>
        
    
  );
}

export default Header;
