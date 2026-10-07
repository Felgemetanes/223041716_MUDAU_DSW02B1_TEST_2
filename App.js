import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Pressable, ActivityIndicator } from "react-native";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";


// 1.1 Real-time Firestore data

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // Inputs for new task
  const [title, setTitle] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [priority, setPriority] = useState("Low");

  // 1.1 Real-time listener for tasks
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "tasks"),
      snapshot => {
        const list = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setTasks(list);
        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub(); // clean up listener when screen closes
  }, []);


  // 1.2 Add/Create a new task
 
  async function addTask() {
    if (!title || !moduleCode) {
      setError("Title and Module Code required");
      return;
    }
    try {
      await addDoc(collection(db, "tasks"), {
        title,
        moduleCode,
        priority,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setModuleCode("");
      setPriority("Low");
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }

  // 1.3 Toggle/Update task completion state
  
  async function toggleComplete(task) {
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        completed: !task.completed,
      });
    } catch (e) {
      setError(e.message);
    }
  }


  // 1.4 Delete the task
  
  async function deleteTask(taskId) {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (e) {
      setError(e.message);
    }
  }

  
  // 1.5 Reliability and interface states
 
  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text style={{ color: "red" }}>Error: {error}</Text>;
  if (tasks.length === 0) return <Text>No tasks yet</Text>;

 
  // 1.6 TaskCard component
  
  const TaskCard = ({ task }) => (
    <View style={{
      padding: 10,
      margin: 5,
      backgroundColor: task.completed ? "#d4edda" : "#f8d7da"
    }}>
      <Text style={{ fontWeight: "bold" }}>{task.title} ({task.moduleCode})</Text>
      <Text>Priority: {task.priority}</Text>
      <Pressable onPress={() => toggleComplete(task)}>
        <Text>{task.completed ? "Mark Incomplete" : "Mark Completed"}</Text>
      </Pressable>
      <Pressable onPress={() => deleteTask(task.id)}>
        <Text style={{ color: "red" }}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 5 }}
      />
      <TextInput
        placeholder="Module Code"
        value={moduleCode}
        onChangeText={setModuleCode}
        style={{ borderWidth: 1, marginBottom: 5 }}
      />
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {["Low", "Medium", "High"].map(p => (
          <Pressable key={p} onPress={() => setPriority(p)} style={{ marginRight: 10 }}>
            <Text style={{ fontWeight: priority === p ? "bold" : "normal" }}>{p}</Text>
          </Pressable>
        ))}
      </View>
      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
      />
    </View>
  );
}

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ActivityIndicator } from "react-native";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";


// 2.1 Registration and login of a new user

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  //login existing user
  async function register() {
    if (!email || !password || !displayName) {
      setError("All fields required");
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        studentName: displayName,
        email,
        createdAt: new Date().toISOString(),
      });
      setError(null);
    } catch (e) {
      setError("Registration failed: " + e.message);
    }
  }

  async function login() {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(null);
    } catch (e) {
      setError("Login failed: " + e.message);
    }
  }

  
  // 2.2 Persistent authentication flow
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(false);
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) {
          setProfile(snap.data());
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsub();
  }, []);

 
  // 2.4 Logout and private-state cleanup
  
  async function logout() {
    await signOut(auth);
    setProfile(null);
  }

  if (loading) return <ActivityIndicator size="large" />;

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ borderWidth: 1, marginBottom: 5 }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, marginBottom: 5 }}
        />
        <TextInput
          placeholder="Display Name (for registration)"
          value={displayName}
          onChangeText={setDisplayName}
          style={{ borderWidth: 1, marginBottom: 5 }}
        />
        <Button title="Register" onPress={register} />
        <Button title="Login" onPress={login} />
        {error && <Text style={{ color: "red" }}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome {profile?.studentName}</Text>
      <Text>Email: {profile?.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}


