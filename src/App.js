import React, { useState, useEffect } from 'react';
import { ReactComponent as RotateBike } from './svg/rotatebike.svg';
import { ReactComponent as MySvg } from './svg/bike.svg';
import { ReactComponent as Parking } from './svg/parking.svg';
import { ReactComponent as Empty } from './svg/empty.svg';
import { ReactComponent as SingleBike } from './svg/singlebike.svg';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './css/custom.css';

const App = () => {
  const [isParked, setIsParked] = useState(false);
  const [showChargingInitialized, setShowChargingInitialized] = useState(false);
  const [chargingPercentage, setChargingPercentage] = useState(0);
  const [showHello, setShowHello] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [startSlide, setStartSlide] = useState(false);
  const [isBikeHidden, setIsBikeHidden] = useState(false);

  const handleAnimationEnd = () => {
    setIsParked(true);
  };

  // Display "Initialized Charging" 2 seconds after parking
  useEffect(() => {
    if (isParked) {
      const timer1 = setTimeout(() => {
        setShowChargingInitialized(true);
      }, 2000);

      return () => clearTimeout(timer1);
    }
  }, [isParked]);

  // Display "Charging" 2 seconds after "Initialized Charging"
  useEffect(() => {
    if (showChargingInitialized) {
      const timer2 = setTimeout(() => {
        setShowHello(true);
      }, 2000);

      return () => clearTimeout(timer2);
    }
  }, [showChargingInitialized]);

  useEffect(() => {
    let chargingInterval;
    if (showHello) {
      // Start charging increment
      chargingInterval = setInterval(() => {
        setChargingPercentage((prev) => {
          if (prev >= 100) {
            clearInterval(chargingInterval); // Clear interval if charging is complete
            setShowEmpty(true); // Show empty state when charging is complete
            return 10; // Ensure it doesn't exceed 100
          }
          return prev + 1; // Increment by 1
        });
      }, 100); // Adjust interval speed as needed

      const timer3 = setTimeout(() => {
        setStartSlide(true); // Start slide animation after 2 seconds
      }, 2000);

      return () => {
        clearInterval(chargingInterval); // Clean up interval on unmount
        clearTimeout(timer3); // Clean up timeout on unmount
      };
    }
  }, [showHello]);

  // Handle animation end for hiding bike
  const handleSlideEnd = () => {
    setIsBikeHidden(true); // Hide the bike once animation completes
  };

  return (
    <div className='d-flex justify-content-center black-color'>
      {!showChargingInitialized ? (
        <div>
          <div className='image-container'>
            <Parking />
            <MySvg className="overlay-svg" onAnimationEnd={handleAnimationEnd} />
            <div className="status-text">{isParked ? "Parked" : "Parking"}</div>
          </div>
        </div>
      ) : !showHello ? (
        <div>
          <Empty />
          <div className='charging-initialized'>
            Initialized Charging
          </div>
        </div>
      ) : !showEmpty ? (
        <div>
          <RotateBike />
          <SingleBike className='charging-overlay' />
          <div style={{  width: '100px',height: '100px',marginTop: '20px',position: 'absolute',top: '28%',left: '45%', }}>
            <CircularProgressbar
              value={chargingPercentage}
              text={`${chargingPercentage}%`}
              styles={buildStyles({
                textSize: '16px',
                pathColor: 'green',
                textColor: '#fff',
                trailColor: '#d6d6d6',

              })}
            />
          </div>
          <div className='charging'>Charging</div>
        </div>
      ) : (
        <div>
          <Empty />
          <SingleBike
            className={`${startSlide ? 'charging-overlay-finished' : ''} ${
              isBikeHidden ? 'hidden' : ''
            }`}
            onAnimationEnd={handleSlideEnd}
          />
          <div className='charge-end'>Your EV is Charged</div>
          <div className='charge-finish'>Go Wireless</div>
        </div>
      )}
    </div>
  );
};

export default App;



