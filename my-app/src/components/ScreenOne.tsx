import { Dialogs } from '@nativescript/core';
import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { FrameNavigationProp } from "react-nativescript-navigation";

import { MainStackParamList } from "../NavigationParamList";

type ScreenOneProps = {
    route: RouteProp<MainStackParamList, "One">,
    navigation: FrameNavigationProp<MainStackParamList, "One">,
};

const ScreenOne = ({ navigation }: ScreenOneProps) => {
    return (
        <div className="flex flex-col space-y-4">
            <label className="text-3xl text-center h-12">
                Screen 1
            </label>

            <button 
                className="w-32 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => navigation.navigate("Two", { message: "Hello, world!" })}
            >
                Go to Screen 2
            </button>

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

export default ScreenOne;
