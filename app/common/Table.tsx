


import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Table = () => {
  const data = [
    { id: 1, name: 'J', age: 28, role: 'Developer' },
    { id: 2, name: 'Ja', age: 32, role: 'Designer' },
    { id: 3, name: 'Bo', age: 45, role: 'Manager' },
    { id: 4, name: 'Lia', age: 30, role: 'Tester' },
    { id: 5, name: 'Max', age: 40, role: 'Admin' },
    { id: 1, name: 'J', age: 28, role: 'Developer' },
    { id: 2, name: 'Ja', age: 32, role: 'Designer' },
    { id: 3, name: 'Bo', age: 45, role: 'Manager' },
    { id: 4, name: 'Lia', age: 30, role: 'Tester' },
    { id: 5, name: 'Max', age: 40, role: 'Admin' },
    { id: 1, name: 'J', age: 28, role: 'Developer' },
    { id: 2, name: 'Ja', age: 32, role: 'Designer' },
    { id: 3, name: 'Bo', age: 45, role: 'Manager' },
    { id: 4, name: 'Lia', age: 30, role: 'Tester' },
    { id: 5, name: 'Max', age: 40, role: 'Admin' },
    { id: 1, name: 'J', age: 28, role: 'Developer' },
    { id: 2, name: 'Ja', age: 32, role: 'Designer' },
    { id: 3, name: 'Bo', age: 45, role: 'Manager' },
    { id: 4, name: 'Lia', age: 30, role: 'Tester' },
    { id: 5, name: 'Max', age: 40, role: 'Admin' },
  ];

  return (
    <ScrollView style={{ flex: 1 }}>
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.cell]}>ID</Text>
            <Text style={[styles.tableHeader, styles.cell]}>Name</Text>
            <Text style={[styles.tableHeader, styles.cell]}>Age</Text>
            <Text style={[styles.tableHeader, styles.cell]}>Role</Text>
          </View>
          {data.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              <Text style={styles.cell}>{item.id}</Text>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.age}</Text>
              <Text style={styles.cell}>{item.role}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    width: screenWidth * 2, // Set the width of the table to ensure horizontal scroll
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
});

export default Table;
