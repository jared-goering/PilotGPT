import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

export default function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.menuTitle}>Menu</Text>
                <DrawerItem label="Profile" onPress={() => {}} />
                <DrawerItem label="Settings" onPress={() => {}} />
                <DrawerItem label="Help Center" onPress={() => {}} />
                <View style={styles.subscribeContainer}>
                    <Text style={styles.subscribeTitle}>Subscribe Now</Text>
                    <Text style={styles.subscribeText}>Unlock the benefits and elevate your experience with our premium subscription.</Text>
                    <TouchableOpacity style={styles.subscribeButton}>
                        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Add background color to drawer content
        paddingTop: 50, // Adjust top padding to avoid overlap with status bar
    },
    innerContainer: {
        flex: 1,
        padding: 20,
    },
    menuTitle: {
        fontSize: 24,
        marginBottom: 20,
    },
    subscribeContainer: {
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 10,
        marginVertical: 20,
    },
    subscribeTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    subscribeText: {
        color: '#fff',
        marginBottom: 20,
    },
    subscribeButton: {
        backgroundColor: '#DCF8C6',
        padding: 10,
        borderRadius: 5,
    },
    subscribeButtonText: {
        textAlign: 'center',
        color: '#000',
    },
    logoutButton: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    logoutButtonText: {
        textAlign: 'center',
        color: '#000',
    },
});
