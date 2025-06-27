import { useState } from 'react';
import Images from './SliderData';
import './SliderOne.css'

function SliderOne() {
    const [activeIndex, setActiveIndex] = useState(0);
    // Function to go to the next slide
    const goToNextSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % Images.length);
    };

    // Function to go to the previous slide
    const goToPrevSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + Images.length) % Images.length);
    };
    return (
        <div className="Slider_container">
            <button className="slider_button slider_button_prev" onClick={goToPrevSlide}>{'<'}</button>

            {Images.map((data, index) => {
                let positionClass = '';
                if (index === activeIndex) { positionClass = 'is-active'; }
                else if (index === (activeIndex - 1 + Images.length) % Images.length) { positionClass = 'is-prev'; }
                else if (index === (activeIndex + 1) % Images.length) { positionClass = 'is-next'; }
                else { positionClass = 'is-far-away' }
                return (
                    <div key={index} className={`Slider_item ${positionClass}`}  >
                        <img src={data.image} alt={data.imgAlt} />
                    </div>
                )
            })}
            <button className='slider_button slider_button_next' onClick={goToNextSlide}>{'>'}</button>
        </div>
    )
};
export default SliderOne;