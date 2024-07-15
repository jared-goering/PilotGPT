// src/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

export default function HomeScreen() {
    const [query, setQuery] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const userId = 'user123'; // You can dynamically generate or retrieve this from user context

    const handleQuery = async () => {
        if (!query.trim()) {
            alert('Please enter a question.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/query', { query, userId });
            const newMessage = {
                role: 'assistant',
                content: response.data.answer
            };
            setConversation([...conversation, { role: 'user', content: query }, newMessage]);
            setQuery('');
        } catch (error) {
            console.error('Error querying documents:', error);
            alert('Error querying documents');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>PilotGPT</Text>
            <Spinner visible={loading} textContent={'Loading...'} textStyle={styles.spinnerText} />
            <Text style={styles.subHeader}>Ask a Question</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your question"
                value={query}
                onChangeText={setQuery}
            />
            <Button title="Search" onPress={handleQuery} />
            <ScrollView style={styles.resultsSection} contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.resultsHeader}>Conversation:</Text>
                {conversation.map((msg, index) => (
                    <View key={index} style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                        <Text style={styles.messageRole}>{msg.role === 'user' ? 'You' : 'Assistant'}:</Text>
                        <Text style={styles.messageContent}>{msg.content}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        fontSize: 18,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 20,
    },
    resultsSection: {
        flex: 1,
        width: '100%',
        backgroundColor: '#2c2c2c',
        padding: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    resultsHeader: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 10,
    },
    userMessage: {
        backgroundColor: '#d1e7dd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    assistantMessage: {
        backgroundColor: '#f8d7da',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    messageRole: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    messageContent: {
        color: '#000',
    },
    spinnerText: {
        color: '#fff',
    },
});
