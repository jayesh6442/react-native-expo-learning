import React, { createContext, useContext, useState } from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";

interface AlertConfig {
    title: string;
    message: string;
    type?: "success" | "error" | "info" | "warning";
    onClose?: () => void;
}

interface AlertContextType {
    show: (config: AlertConfig) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [alert, setAlert] = useState<AlertConfig | null>(null);
    const [visible, setVisible] = useState(false);
    const scaleAnim = React.useRef(new Animated.Value(0)).current;

    const show = (config: AlertConfig) => {
        setAlert(config);
        setVisible(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 12,
            bounciness: 10,
        }).start();

        // Auto close after 3 seconds
        setTimeout(() => {
            handleClose();
        }, 3000);
    };

    const handleClose = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
            alert?.onClose?.();
        });
    };

    const getColors = () => {
        switch (alert?.type) {
            case "success":
                return { bgClass: "bg-green-500", icon: "✓" };
            case "error":
                return { bgClass: "bg-red-500", icon: "✕" };
            case "warning":
                return { bgClass: "bg-amber-500", icon: "⚠" };
            default:
                return { bgClass: "bg-blue-500", icon: "ℹ" };
        }
    };

    const { bgClass, icon } = getColors();

    return (
        <AlertContext.Provider value={{ show }}>
            {children}
            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={handleClose}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <Animated.View
                        style={{
                            transform: [{ scale: scaleAnim }],
                        }}
                        className="bg-white rounded-3xl px-8 py-8 w-4/5 shadow-2xl"
                    >
                        {/* Icon */}
                        <View
                            className={`w-16 h-16 rounded-full items-center justify-center self-center mb-6 ${bgClass}`}
                        >
                            <Text className="text-white text-3xl font-bold">{icon}</Text>
                        </View>

                        {/* Title */}
                        <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
                            {alert?.title}
                        </Text>

                        {/* Message */}
                        <Text className="text-base text-gray-600 text-center mb-8 leading-6">
                            {alert?.message}
                        </Text>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={handleClose}
                            className="bg-blue-600 rounded-xl py-4 items-center active:bg-blue-700"
                        >
                            <Text className="text-white font-bold text-base">OK</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within AlertProvider");
    }
    return context;
};
