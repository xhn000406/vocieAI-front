import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';

export default function FormDemoScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>表单Demo</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>姓名</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入姓名"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>邮箱</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>密码</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.formGroup}>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>记住我</Text>
          <Switch
            value={switchValue}
            onValueChange={setSwitchValue}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={switchValue ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, submitted && styles.buttonSuccess]}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {submitted ? '提交成功！' : '提交表单'}
        </Text>
      </TouchableOpacity>

      {submitted && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>表单数据：</Text>
          <Text style={styles.resultText}>姓名: {name || '未填写'}</Text>
          <Text style={styles.resultText}>邮箱: {email || '未填写'}</Text>
          <Text style={styles.resultText}>
            密码: {password ? '***' : '未填写'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonSuccess: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  resultText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
  },
});
