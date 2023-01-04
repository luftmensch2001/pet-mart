import stars0 from "../assets/images/reviews/0.png";
import stars1 from "../assets/images/reviews/1.png";
import stars2 from "../assets/images/reviews/2.png";
import stars3 from "../assets/images/reviews/3.png";
import stars4 from "../assets/images/reviews/4.png";
import stars5 from "../assets/images/reviews/5.png";

const GetStarImage = (starNumber) => {
    const rounded = Math.round(starNumber);
    switch (rounded) {
        case 0:
            return stars0;
            break;
        case 1:
            return stars1;
            break;
        case 2:
            return stars2;
            break;
        case 3:
            return stars3;
            break;
        case 4:
            return stars4;
            break;
        case 5:
            return stars5;
            break;
    }
};

export default GetStarImage;
