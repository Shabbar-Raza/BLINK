import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";

import { MainStackParamList } from "../NavigationParamList";

type ScreenTwoProps = {
    route: RouteProp<MainStackParamList, "Two">,
    navigation: FrameNavigationProp<MainStackParamList, "Two">,
};

const ScreenTwo = () => {
    return (
        <div className="flex flex-col space-y-4">
            <label className="text-3xl text-center">
                Screen 2
            </label>

            <label className="text-3xl text-center my-5">
                Welcome to Screen 2!
            </label>

            <button 
                className="w-32 px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                    // your tap handler code
                }}
            >
                Go Back
            </button>
        </div>
    );
};

export default ScreenTwo;
