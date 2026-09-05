import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs> 
            <Tabs.Screen name="index" options= {{ title: 'Home' }} />
            <Tabs.Screen name="profile" options= {{ title: 'Profile' }} />
            <Tabs.Screen name="train" options= {{ title: 'Train' }} />
            <Tabs.Screen name="finder" options= {{ title: 'Finder' }} />
            <Tabs.Screen name="ranked" options= {{ title: 'Rank' }} />    
        </Tabs>
    );
}