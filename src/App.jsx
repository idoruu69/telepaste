
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, serverTimestamp, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { Copy, Route, Link2Off, LogOut, Check, AlertCircle, Bomb, Image as ImageIcon, Globe, Lightbulb, Download, X, Users, Zap, UserX, ShieldCheck } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react'; 
import { getAnalytics, logEvent } from "firebase/analytics"; 
import { SpeedInsights } from "@vercel/speed-insights/react"

// --- Konfigurasi Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyDRd-xRNe-uSNH4xGfn-L7VXJtOVLJA0Ps",
  authDomain: "telepaste-54a69.firebaseapp.com",
  projectId: "telepaste-54a69",
  storageBucket: "telepaste-54a69.firebasestorage.app",
  messagingSenderId: "100238589023",
  appId: "1:100238589023:web:3fd20a89c7c23370eb6fea",
  measurementId: "G-6CNFMLKXNS"
};


const app = Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = 'telepaste-v1-4';

// --- Kamus Terjemahan (i18n) & Array Tips ---
const translations = {
  en: {
    appTitle: "TelePaste",
    appSubtitle: "Teleport your clipboard.",
    roomPin: "PORTAL PIN",
    createBridge: "Open Portal",
    joinText: "OR JOIN",
    joinBtn: "Enter",
    pinPlaceholder: "4 Digit PIN",
    syncDesc: "Transfer text, images, and clean links instantly. No login required.",
    cleanLinks: "Clean Links",
    nuke: "Nuke",
    copy: "Copy Text",
    copied: "Copied!",
    editorPlaceholder: "Start typing here... Paste images directly inside the text!",
    autoSaving: "Auto-saving",
    chars: "chars",
    errAuth: "Failed to connect to auth server",
    errSync: "Failed to sync data",
    errCreate: "Failed to open portal",
    errPin: "PIN must be 4 digits",
    errNotFound: "Portal not found or has not been created.",
    errExpired: "Portal expired (inactive) and has been deleted.",
    errImgSize: "Image is too large (Max 300KB)",
    msgCleaned: "Tracking links removed!",
    msgAlreadyClean: "Text is already clean.",
    msgNuked: "Data trace destroyed!",
    msgCopied: "Text copied to clipboard!",
    msgCopyFailed: "Failed to copy text",
    msgImgAdded: "Image teleported!",
    downloadBtn: "Download",
    adSpace: "Advertisement Space",
    loadingPortal: "Initiating Portal Beam...",
    loadingJoin: "Searching Portal Coordinates...",
    feat1Title: "Lightning Fast",
    feat1Desc: "Instantly transfer text, links, and documents across all your devices in real-time.",
    feat2Title: "Zero Login",
    feat2Desc: "Skip the tedious sign-ups. Generate a 4-digit PIN and you're good to go instantly.",
    feat3Title: "Auto-Destruct",
    feat3Desc: "Ghost rooms are automatically destroyed when everyone leaves or after 2 mins of inactivity.",
    seoFooter: "TelePaste is the best free online clipboard application for transferring text and images between devices without needing to log in",
    tips: [
      "Open this site on your phone and enter the PIN above to sync instantly.",
      "Hover or click an image to enlarge and download it.",
      "Click 'Clean Links' to remove annoying tracking tags from long URLs.",
      "Click 'Nuke' (Bomb icon) to permanently destroy all data in this portal.",
      "You can paste images (Ctrl+V) directly alongside your text."
    ]
  },
  id: {
    appTitle: "TelePaste",
    appSubtitle: "Teleportasi teks dan gambarmu.",
    roomPin: "PIN PORTAL",
    createBridge: "Buka Portal",
    joinText: "ATAU GABUNG",
    joinBtn: "Masuk",
    pinPlaceholder: "PIN 4 Digit",
    syncDesc: "Pindahkan teks, transfer gambar, dan bersihkan link sekejap. Tanpa perlu login.",
    cleanLinks: "Bersihkan Link",
    nuke: "Hancurkan",
    copy: "Salin Teks",
    copied: "Tersalin!",
    editorPlaceholder: "Mulai mengetik di sini... Anda bisa paste gambar di tengah teks!",
    autoSaving: "Menyimpan otomatis",
    chars: "karakter",
    errAuth: "Gagal terhubung ke server autentikasi",
    errSync: "Gagal sinkronisasi data",
    errCreate: "Gagal membuka portal",
    errPin: "PIN harus 4 digit",
    errNotFound: "Portal tidak ditemukan atau belum dibuat.",
    errExpired: "Portal sudah kedaluwarsa (tidak aktif) dan telah dihapus.",
    errImgSize: "Gambar terlalu besar (Maks 300KB)",
    msgCleaned: "Link pelacak berhasil dibersihkan!",
    msgAlreadyClean: "Teks sudah bersih.",
    msgNuked: "Jejak data berhasil dihancurkan!",
    msgCopied: "Teks berhasil disalin!",
    msgCopyFailed: "Gagal menyalin teks",
    msgImgAdded: "Gambar diteleportasi!",
    downloadBtn: "Unduh",
    adSpace: "Ruang Iklan",
    loadingPortal: "Membuka Saluran Portal...",
    loadingJoin: "Mencari Koordinat Portal...",
    feat1Title: "Secepat Kilat",
    feat1Desc: "Kirim teks, link, dan file antar perangkat secara instan dan real-time.",
    feat2Title: "Tanpa Login",
    feat2Desc: "Lewati proses pendaftaran yang ribet. Cukup buat PIN 4 digit dan langsung gunakan.",
    feat3Title: "Privasi Terjamin",
    feat3Desc: "Ruangan akan musnah otomatis secara permanen saat Anda keluar atau 2 menit tanpa aktivitas.",
    seoFooter: "TelePaste adalah aplikasi clipboard online gratis terbaik untuk memindahkan teks dan gambar antar perangkat tanpa perlu login.",
    tips: [
      "Buka web ini di HP Anda, masukkan PIN di atas untuk saling terhubung.",
      "Klik gambar di dalam kanvas untuk memperbesar dan mengunduhnya.",
      "Gunakan fitur 'Bersihkan Link' untuk menghapus kode pelacak dari URL panjang.",
      "Tombol Bom (Hancurkan) akan melenyapkan semua teks secara permanen.",
      "Anda bisa langsung paste gambar (Ctrl+V) menyatu di dalam kalimat."
    ]
  },
  ja: {
    appTitle: "TelePaste",
    appSubtitle: "クリップボードをテレポート",
    roomPin: "ポータル PIN",
    createBridge: "ポータルを開く",
    joinText: "または参加",
    joinBtn: "入る",
    pinPlaceholder: "4桁のPIN",
    syncDesc: "テキスト、画像転送、リンクのクリーンアップを瞬時に。ログイン不要。",
    cleanLinks: "リンクをクリーン",
    nuke: "全消去",
    copy: "テキストをコピー",
    copied: "コピーしました！",
    editorPlaceholder: "ここに入力... テキスト内に画像を直接貼り付けることができます！",
    autoSaving: "自動保存中",
    chars: "文字",
    errAuth: "認証サーバーへの接続に失敗しました",
    errSync: "データの同期に失敗しました",
    errCreate: "ポータルの作成に失敗しました",
    errPin: "PINは4桁である必要があります",
    errNotFound: "ポータルが見つからないか、まだ作成されていません。",
    errExpired: "ポータルは無効（非アクティブ）になり、削除されました。",
    errImgSize: "画像が大きすぎます（最大300KB）",
    msgCleaned: "トラッキングリンクを削除しました！",
    msgAlreadyClean: "テキストはすでにクリーンです。",
    msgNuked: "データの痕跡を破壊しました！",
    msgCopied: "テキストをコピーしました！",
    msgCopyFailed: "テキストのコピーに失敗しました",
    msgImgAdded: "画像をテレポートしました！",
    downloadBtn: "ダウンロード",
    adSpace: "広告スペース",
    loadingPortal: "ポータルを起動中...",
    loadingJoin: "ポータル座標を検索中...",
    feat1Title: "超高速",
    feat1Desc: "すべてのデバイス間でテキスト、リンク、ファイルをリアルタイムで瞬時に送信します。",
    feat2Title: "ログイン不要",
    feat2Desc: "面倒な登録はスキップ。4桁のPINを生成するだけですぐに使えます。",
    feat3Title: "自動消滅で安全",
    feat3Desc: "全員が退出するか、2分間操作がないと、部屋のデータは自動的に永久破棄されます。",
    seoFooter: "TelePasteは、ログインやインストールなしでスマホとPC間でテキストやファイルを共有できる最高の無料オンラインクリップボードです。",
    tips: [
      "スマホでこのサイトを開き、上のPINを入力すると同期します。",
      "画像をクリックすると拡大表示され、ダウンロードできます。",
      "「リンクをクリーン」で不要な追跡コードを削除します。",
      "爆弾アイコン（全消去）ですべてのデータを完全に消去します。",
      "テキストの横に直接画像を貼り付ける（Ctrl+V）ことができます。"
    ]
  }
};

const analytics = app ? getAnalytics(app) : null; 

export default function App() {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [status, setStatus] = useState('disconnected');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);
  const [lang, setLang] = useState('id');
  const [charCount, setCharCount] = useState(0);
  
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0); 
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  
  // --- STATE & REF BARU UNTUK FITUR USER TRACKING ---
  const [activeUserCount, setActiveUserCount] = useState(0);
  const charCountRef = useRef(0);
  const activeUserCountRef = useRef(0);
  const pinRef = useRef('');

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastSentHtml = useRef(''); 


  useEffect(() => {
    if (analytics && pin) {
      logEvent(analytics, 'portal_joined', { pin: pin });
    }
  }, [pin]);




  // Sinkronisasi state ke ref agar bisa dibaca oleh event browser
  useEffect(() => { charCountRef.current = charCount; }, [charCount]);
  useEffect(() => { activeUserCountRef.current = activeUserCount; }, [activeUserCount]);
  useEffect(() => { pinRef.current = pin; }, [pin]);

  // Peringatan saat akan menutup Tab (Close Browser)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Jika kita di dalam room, teks tidak kosong, dan kita adalah ORANG TERAKHIR
      if (pinRef.current && charCountRef.current > 0 && activeUserCountRef.current <= 1) {
        e.preventDefault();
        e.returnValue = ''; // Ini baris wajib untuk memunculkan pop-up peringatan bawaan browser
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Inisialisasi Bahasa
  useEffect(() => {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('en')) setLang('en');
    else if (browserLang.startsWith('ja')) setLang('ja');
    else setLang('id');
  }, []);

  const t = translations[lang] || translations['id'];

  // Interval Carousel Tips
  useEffect(() => {
    if (!pin) return; 
    const intervalId = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % t.tips.length);
    }, 5000); 
    return () => clearInterval(intervalId); 
  }, [pin, t.tips.length]);

  // Firebase Auth
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        showToast(t.errAuth, "error");
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, [auth, t.errAuth]);

  // Firebase Sync Realtime
  useEffect(() => {
    if (!user || !pin || !db) return;

    setStatus('connecting');
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'bridges', pin);

    // Daftarkan user ini masuk ke dalam room dan catat waktu aktif (updatedAt)
    setDoc(docRef, { activeUsers: arrayUnion(user.uid), updatedAt: serverTimestamp() }, { merge: true }).catch(err => console.error(err));

    // --- FITUR BARU: HEARTBEAT (Detak Jantung) ---
    // Kirim sinyal setiap 30 detik bahwa user masih aktif di ruangan ini
    const heartbeatInterval = setInterval(() => {
      setDoc(docRef, { updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
    }, 30000);

    // Jika user nekat tutup tab, HAPUS RUANGAN kalau dia orang terakhir
    const handleUnload = () => {
      if (activeUserCountRef.current <= 1) {
        // Hapus DOKUMEN secara permanen dari database
        deleteDoc(docRef).catch(err => console.error("Gagal hapus room:", err));
      } else {
        // Kalau masih ada orang lain, cukup cabut user dari daftar
        setDoc(docRef, { activeUsers: arrayRemove(user.uid), updatedAt: serverTimestamp() }, { merge: true });
      }
    };
    window.addEventListener('unload', handleUnload);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      setStatus('connected');
      setIsPortalLoading(false); 

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Update jumlah pengguna yang ada di room
        if (data.activeUsers) {
          setActiveUserCount(data.activeUsers.length);
        }

        if (editorRef.current && data.html !== undefined) {
          if (data.html !== lastSentHtml.current && data.html !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = data.html;
            lastSentHtml.current = data.html;
            updateCharCount();
          }
        }
      } else if (editorRef.current) {
        // Ini akan berjalan jika ruangan baru saja dihapus oleh orang lain
        editorRef.current.innerHTML = '';
        lastSentHtml.current = '';
        updateCharCount();
      }
    }, (error) => {
      setStatus('disconnected');
      setIsPortalLoading(false);
      showToast(t.errSync, "error");
    });

    return () => {
      clearInterval(heartbeatInterval);
      unsubscribe();
      window.removeEventListener('unload', handleUnload);
    };
  }, [user, pin, db, t.errSync]);

  const updateCharCount = () => {
    if (editorRef.current) {
      setCharCount(editorRef.current.innerText.length);
    }
  };

  const handleInput = () => {
    if (!editorRef.current || !pin || !user || !db) return;
    
    const currentHtml = editorRef.current.innerHTML;
    lastSentHtml.current = currentHtml;
    updateCharCount();
    
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'bridges', pin);
    setDoc(docRef, { html: currentHtml, updatedAt: serverTimestamp() }, { merge: true })
      .catch(err => console.error("Write error:", err));
  };

  const compressAndConvertImage = (file) => {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) return reject(new Error("File terlalu besar"));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.5); 
          if (dataUrl.length > 400 * 1024) reject(new Error("Gambar masih terlalu besar"));
          else resolve(dataUrl);
        };
      };
      reader.onerror = error => reject(error);
    });
  };

  const insertImageAtCursor = (base64Url) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const img = document.createElement('img');
    img.src = base64Url;
    img.alt = "inline-image";
    img.style.cssText = "max-height: 120px; max-width: 100%; display: inline-block; vertical-align: middle; margin: 0 6px; border-radius: 6px; border: 2px solid #374151; cursor: zoom-in;";

    const sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      let range = sel.getRangeAt(0);
      
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(img);
        
        range = range.cloneRange();
        range.setStartAfter(img);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        editorRef.current.appendChild(img);
      }
    } else {
      editorRef.current.appendChild(img);
    }

    const space = document.createTextNode("\u00A0"); 
    const range = window.getSelection().getRangeAt(0);
    range.insertNode(space);
    range.setStartAfter(space);
    range.collapse(true);

    handleInput();
    showToast(t.msgImgAdded, "success");
  };

  const processFile = async (file) => {
    if (!file.type.startsWith('image/')) return;
    showToast("Memproses gambar...", "info");
    try {
      const base64Image = await compressAndConvertImage(file);
      insertImageAtCursor(base64Image);
    } catch (error) {
      showToast(t.errImgSize, "error");
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); 
    const items = e.clipboardData.items;
    let hasImage = false;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        processFile(file);
        hasImage = true;
        break; 
      }
    }

    if (!hasImage) {
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
      handleInput(); 
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleEditorClick = (e) => {
    if (e.target.tagName === 'IMG') {
      setEnlargedImage(e.target.src);
    }
  };

  const downloadImage = (base64Url) => {
    const link = document.createElement('a');
    link.href = base64Url;
    link.download = `telepaste_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Mengunduh gambar...", "success");
  };

  const cleanLinks = () => {
    if (!editorRef.current) return;
    
    const originalHtml = editorRef.current.innerHTML;
    const urlRegex = /(?<!src=["']|href=["'])(https?:\/\/[^\s<]+)/g;
    
    const cleanedHtml = originalHtml.replace(urlRegex, (url) => {
      try {
        const parsedUrl = new URL(url);
        const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'igshid', 'fbclid', 'gclid', 'si'];
        paramsToRemove.forEach(param => parsedUrl.searchParams.delete(param));
        return parsedUrl.toString();
      } catch (e) { return url; }
    });

    if (cleanedHtml !== originalHtml) {
      editorRef.current.innerHTML = cleanedHtml;
      handleInput();
      showToast(t.msgCleaned, "success");
    } else {
      showToast(t.msgAlreadyClean, "info");
    }
  };

  const nukeData = async () => {
    if (!pin || !user || !editorRef.current || !db) return;
    
    editorRef.current.innerHTML = '';
    lastSentHtml.current = '';
    updateCharCount();
    
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'bridges', pin);
      await setDoc(docRef, { html: '', updatedAt: serverTimestamp() }, { merge: true });
      showToast(t.msgNuked, "success");
    } catch (error) {
      showToast("Gagal menghapus", "error");
    }
  };

  const createBridge = async () => {
    if (!db) {
      showToast("Database belum terhubung. Cek config Firebase.", "error");
      return;
    }
    
    setIsPortalLoading(true); 

    try {
      let newPin = "";
      let isSafeToCreate = false;

      // Coba cari PIN kosong ATAU timpa ghost room yang sudah kedaluwarsa
      for (let i = 0; i < 5; i++) {
        const tempPin = Math.floor(1000 + Math.random() * 9000).toString();
        const checkRef = doc(db, 'artifacts', appId, 'public', 'data', 'bridges', tempPin);
        const checkSnap = await getDoc(checkRef);

        if (!checkSnap.exists()) {
          newPin = tempPin;
          isSafeToCreate = true;
          break;
        } else {
          // Jika PIN sudah ada, cek apakah ini Ghost Room
          const data = checkSnap.data();
          const timestamp = data.updatedAt || data.createdAt;
          const lastActive = timestamp && typeof timestamp.toMillis === 'function' ? timestamp.toMillis() : 0;
          const activeUsers = data.activeUsers || [];
          
          const isAbandonedByTimeout = lastActive > 0 && (Date.now() - lastActive > 2 * 60 * 1000); // 2 Menit (120000 ms)
          const isAbandonedByEmpty = activeUsers.length === 0;

          if (isAbandonedByTimeout || isAbandonedByEmpty) {
            // Ini Ghost Room! Kita bisa mendaur ulang PIN ini.
            newPin = tempPin;
            isSafeToCreate = true;
            break;
          }
        }
      }

      // Fallback jika tidak nemu (sangat jarang terjadi)
      if (!isSafeToCreate) {
        newPin = Math.floor(1000 + Math.random() * 9000).toString();
      }

      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'bridges', newPin);
      await setDoc(docRef, { 
        html: "", 
        activeUsers: [user.uid], // Langsung masukkan pembuatnya ke daftar
        createdAt: serverTimestamp(), 
        updatedAt: serverTimestamp() 
      });
      
      setPin(newPin);
      setCurrentTipIndex(0); 
      if (editorRef.current) editorRef.current.innerHTML = '';
      lastSentHtml.current = '';
      updateCharCount();
    } catch (error) {
      setIsPortalLoading(false); 
      showToast(t.errCreate, "error");
    }
  };

  // --- LOGIKA JOIN PORTAL (DILENGKAPI PENGECEKAN KEDALUWARSA INSTAN & 2 MENIT) ---
  const joinBridge = async () => {
    if (!db) {
      showToast("Database belum terhubung.", "error");
      return;
    }

    if (inputPin.length === 4) {
      setIsPortalLoading(true);
      
      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'bridges', inputPin);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const timestamp = data.updatedAt || data.createdAt;
          const lastActive = timestamp && typeof timestamp.toMillis === 'function' ? timestamp.toMillis() : 0;
          const activeUsers = data.activeUsers || [];
          
          const isAbandonedByTimeout = lastActive > 0 && (Date.now() - lastActive > 2 * 60 * 1000); // 2 Menit
          const isAbandonedByEmpty = activeUsers.length === 0;
          
          if (isAbandonedByTimeout || isAbandonedByEmpty) {
            // Ini adalah Ghost Room (kosong atau umur > 2 menit), hapus dan tolak masuk.
            await deleteDoc(docRef);
            setIsPortalLoading(false);
            showToast(t.errExpired, "error");
            return;
          }

          // Kalau ruangannya ada dan benar-benar aktif, izinkan masuk
          setPin(inputPin);
          setCurrentTipIndex(0); 
          if (editorRef.current) editorRef.current.innerHTML = '';
          lastSentHtml.current = '';
          updateCharCount();
        } else {
          // Kalau tidak ada, tolak dan beri peringatan
          setIsPortalLoading(false);
          showToast(t.errNotFound, "error");
        }
      } catch (error) {
        setIsPortalLoading(false);
        showToast(t.errSync, "error");
      }
    } else {
      showToast(t.errPin, "error");
    }
  };

  const disconnect = async () => {
    // --- FITUR AUTO-DELETE SAAT ORANG TERAKHIR KELUAR ---
    if (pin && user && db) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'bridges', pin);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const currentUsers = data.activeUsers || [];
          // Hapus ID kita sendiri dari daftar
          const remainingUsers = currentUsers.filter(uid => uid !== user.uid);
          
          if (remainingUsers.length === 0) {
            // Ini orang terakhir! Hapus RUANGANNYA SECARA PERMANEN DARI DATABASE
            await deleteDoc(docRef);
          } else {
            // Masih ada orang lain, cukup update sisa pengunjungnya
            await setDoc(docRef, { activeUsers: remainingUsers, updatedAt: serverTimestamp() }, { merge: true });
          }
        }
      } catch (error) {
        console.error("Gagal membersihkan room:", error);
      }
    }

    setPin('');
    setInputPin('');
    if (editorRef.current) editorRef.current.innerHTML = '';
    lastSentHtml.current = '';
    setStatus('disconnected');
    setCharCount(0);
    setActiveUserCount(0);
  };

  const copyAllText = () => {
    if (!editorRef.current) return;
    const textOnly = editorRef.current.innerText;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textOnly)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          showToast(t.msgCopied, "success");
        })
        .catch(err => {
          fallbackCopyText(textOnly);
        });
    } else {
      fallbackCopyText(textOnly);
    }
  };

  const fallbackCopyText = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast(t.msgCopied, "success");
      } else {
        showToast(t.msgCopyFailed, "error");
      }
    } catch (err) {
      showToast(t.msgCopyFailed, "error");
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };



  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30 flex flex-col overflow-x-hidden">
      
      {/* UI Loading Portal */}
      {isPortalLoading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in-down p-6 text-center">
          <div className="relative flex items-center justify-center mb-10 group">
            <div className="w-16 h-16 bg-gradient-to-t from-indigo-700 to-white rounded-full absolute shadow-lg shadow-indigo-500/50 scale-100 animate-ping-fast opacity-90"></div>
            <div className="w-28 h-28 border-4 border-dashed border-indigo-400 rounded-full absolute animate-spin-reverse-slow opacity-60"></div>
            <div className="w-36 h-36 border-4 border-dashed border-indigo-600 rounded-full animate-spin-slow opacity-80"></div>
            <div className="w-6 h-6 bg-white rounded-full absolute shadow-2xl shadow-white/80 animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide bg-gradient-to-r from-indigo-300 via-white to-indigo-300 bg-clip-text text-transparent animate-text-shimmer">
            {status === 'connecting' && pin ? t.loadingJoin : t.loadingPortal}
          </h2>
          <p className="text-sm text-gray-400 font-mono tracking-widest animate-pulse max-w-xs">
            BEAMING DATA IN_OUT
          </p>
        </div>
      )}

      {/* Lightbox Modal (Gambar) */}
      {enlargedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8 animate-fade-in-down" onClick={() => setEnlargedImage(null)}>
          <div className="relative max-w-5xl max-h-full flex items-center justify-center group" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setEnlargedImage(null)} className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 p-2 bg-gray-800 text-gray-300 hover:text-white rounded-full hover:bg-red-500 transition-colors z-10 shadow-lg border border-gray-700">
              <X size={20} />
            </button>
            <img src={enlargedImage} alt="Enlarged view" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-gray-800" />
            <button onClick={() => downloadImage(enlargedImage)} className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-xl shadow-indigo-900/50 flex items-center space-x-2 z-10">
              <Download size={18} />
              <span className="hidden sm:inline">{t.downloadBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 border ${toast.type === 'error' ? 'bg-red-900/50 border-red-500/50 text-red-200' : toast.type === 'success' ? 'bg-green-900/50 border-green-500/50 text-green-200' : 'bg-gray-800 border-gray-700 text-gray-200'}`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {!pin ? (
        // --- TAMPILAN HALAMAN UTAMA (LANDING PAGE & SEO) ---
        <div className="flex-1 w-full flex flex-col">
          {/* Header Minimal khusus Landing Page */}
          <header className="flex justify-end p-4 sm:p-6 relative z-20">
            <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
              <Globe size={16} className="text-gray-400" />
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent text-sm text-gray-300 focus:outline-none appearance-none cursor-pointer">
                <option value="id">ID - Indonesia</option><option value="en">EN - English</option><option value="ja">JA - 日本語</option>
              </select>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-4 pb-16 relative z-10">
            {/* Hero Title (H1 untuk SEO) dengan Desain Baru */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.5)] transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <Route size={40} className="text-white" />
            </div>
            
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                TelePaste
              </span>
            </h1>
            
            <h2 className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl px-4 leading-relaxed font-medium">
              {t.syncDesc}
            </h2>

            {/* Kotak Aksi Utama (Buka Portal Bulat Besar) */}
            <div className="relative flex justify-center items-center mb-16 group cursor-pointer" onClick={createBridge}>
              {/* Decorative pulsing rings */}
              <div className="absolute w-40 h-40 sm:w-56 sm:h-56 bg-indigo-600/20 rounded-full animate-ping-fast pointer-events-none"></div>
              <div className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/20 rounded-full animate-pulse blur-2xl pointer-events-none"></div>
              
              <button disabled={isPortalLoading} className="relative w-36 h-36 sm:w-48 sm:h-48 bg-gradient-to-tr from-gray-900 via-indigo-900 to-indigo-600 hover:to-indigo-500 border border-indigo-400/30 text-white font-black rounded-full transition-all duration-500 shadow-[0_0_50px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_80px_rgba(79,70,229,0.8)] group-hover:scale-105 flex flex-col justify-center items-center z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-full"></div>
                <Route size={44} className="mb-2 text-indigo-300 group-hover:text-white group-hover:scale-110 transition-all duration-300 drop-shadow-lg" />
                <span className="text-sm sm:text-lg tracking-widest uppercase drop-shadow-md">{t.createBridge}</span>
              </button>
            </div>

            {/* Join Section Dipisah */}
            <div className="w-full max-w-sm mx-auto mb-20 sm:mb-28">
              <div className="flex items-center mb-6 space-x-4">
                <div className="flex-1 h-px bg-gray-800/80"></div>
                <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">{t.joinText}</span>
                <div className="flex-1 h-px bg-gray-800/80"></div>
              </div>

              <div className="flex space-x-2 bg-gray-900/60 p-2 rounded-2xl border border-gray-800/80 backdrop-blur-sm shadow-xl focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                <input 
                  type="text" maxLength="4" placeholder={t.pinPlaceholder} value={inputPin}
                  onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-transparent px-4 py-3 text-center text-2xl tracking-widest font-mono text-white placeholder-gray-600 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && joinBridge()}
                />
                <button onClick={joinBridge} disabled={inputPin.length !== 4} className="px-6 bg-white hover:bg-indigo-50 disabled:bg-gray-800 disabled:text-gray-600 text-indigo-900 rounded-xl font-bold transition-colors">
                  {t.joinBtn}
                </button>
              </div>
            </div>

            {/* Teks Pendukung untuk SEO (Fitur-Fitur) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4 text-left">
              <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800/50 hover:bg-gray-900/80 transition-colors">
                <Zap className="text-yellow-400 mb-4" size={28} />
                <h3 className="text-lg font-bold text-gray-200 mb-2">{t.feat1Title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.feat1Desc}</p>
              </div>
              <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800/50 hover:bg-gray-900/80 transition-colors">
                <UserX className="text-blue-400 mb-4" size={28} />
                <h3 className="text-lg font-bold text-gray-200 mb-2">{t.feat2Title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.feat2Desc}</p>
              </div>
              <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800/50 hover:bg-gray-900/80 transition-colors">
                <ShieldCheck className="text-green-400 mb-4" size={28} />
                <h3 className="text-lg font-bold text-gray-200 mb-2">{t.feat3Title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.feat3Desc}</p>
              </div>
            </div>
          </main>

          {/* Footer SEO Text */}
          <footer className="w-full text-center py-8 border-t border-gray-900 mt-auto">
            <p className="text-xs text-gray-600 max-w-3xl mx-auto px-4">{t.seoFooter}</p>
          </footer>
        </div>
      ) : (
        // --- TAMPILAN RUANGAN PORTAL (SAAT SUDAH MASUK/CONNECT) ---
        <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col h-full min-h-0">
          
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pt-2 gap-4 flex-shrink-0">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Route className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{t.appTitle}</h1>
                  <p className="text-[10px] sm:text-xs text-indigo-400 font-mono hidden sm:block">{t.appSubtitle}</p>
                </div>
              </div>

              <div className="sm:hidden flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg px-2 py-1">
                <Globe size={14} className="text-gray-400" />
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent text-xs text-gray-300 focus:outline-none appearance-none">
                  <option value="id">ID</option><option value="en">EN</option><option value="ja">JA</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                <Globe size={16} className="text-gray-400" />
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent text-sm text-gray-300 focus:outline-none appearance-none cursor-pointer">
                  <option value="id">Indonesia</option><option value="en">English</option><option value="ja">日本語</option>
                </select>
              </div>

              <>
                <div className="flex items-center space-x-1.5 bg-gray-900 border border-gray-800 px-3 py-2 rounded-lg" title="Jumlah orang di portal ini">
                  <Users size={16} className="text-indigo-400" />
                  <span className="text-sm font-bold text-white">{activeUserCount}</span>
                </div>

                <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start space-x-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider hidden sm:inline">{t.roomPin}</span>
                  </div>
                  <strong className="text-lg font-mono text-white tracking-widest">{pin}</strong>
                </div>
                <button onClick={disconnect} className="p-2.5 bg-gray-900 hover:bg-red-500/10 border border-gray-800 hover:border-red-500/30 text-gray-400 hover:text-red-400 rounded-lg transition-all" title="Keluar & Hapus (Jika Terakhir)">
                  <LogOut size={18} />
                </button>
              </>
            </div>
          </header>

          <div className="flex-1 flex flex-col min-h-0 gap-3">
            
            {/* Slot Iklan Atas */}
            <div className="w-full flex-shrink-0 bg-gray-900/30 border border-gray-800/50 border-dashed rounded-xl p-1 sm:p-2 flex flex-col items-center justify-center text-gray-600 text-xs">
              <div className="w-full max-w-[728px] h-[40px] bg-gray-950/50 rounded flex items-center justify-center overflow-hidden">
                 <p className="opacity-40" style={{fontSize: '0.65rem'}}>{t.adSpace} (Top)</p>
              </div>
            </div>

            {/* TIPS CAROUSEL */}
            <div key={currentTipIndex} className="flex items-start sm:items-center space-x-3 px-4 py-2 bg-blue-900/10 border border-blue-500/20 rounded-xl text-blue-300/80 text-xs sm:text-sm animate-fade-in flex-shrink-0">
               <Lightbulb size={16} className="text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" />
               <span>Tip {currentTipIndex + 1}/{t.tips.length}: <strong>{t.tips[currentTipIndex]}</strong></span>
            </div>

            {/* Inline Editor Area */}
            <div className="flex-1 flex flex-col bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between bg-gray-900 border-b border-gray-800 p-2 sm:p-3 gap-2 flex-shrink-0">
                <div className="flex space-x-2">
                  <button onClick={cleanLinks} className="flex items-center space-x-2 px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-lg text-sm font-medium" title="Hapus Tracking dari Link">
                    <Link2Off size={16} />
                    <span className="hidden sm:inline">{t.cleanLinks}</span>
                  </button>
                  
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium" title="Upload Gambar dari Komputer">
                    <ImageIcon size={16} />
                    <span className="hidden sm:inline">Image</span>
                  </button>

                  <button onClick={nukeData} className="flex items-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium group" title="Hancurkan Semua Teks">
                    <Bomb size={16} className="group-hover:animate-pulse" />
                    <span className="hidden sm:inline">{t.nuke}</span>
                  </button>
                </div>
                
                <button onClick={copyAllText} className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg text-sm font-bold shadow-lg" title="Salin semua teks">
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  <span>{copied ? t.copied : t.copy}</span>
                </button>
              </div>

              {/* Real ContentEditable Div */}
              <div className="flex-1 relative bg-transparent overflow-y-auto">
                <div
                  ref={editorRef}
                  contentEditable={true}
                  onInput={handleInput}
                  onPaste={handlePaste}
                  onClick={handleEditorClick}
                  className="w-full min-h-full p-4 sm:p-6 text-gray-100 focus:outline-none text-base leading-relaxed break-words"
                  style={{ whiteSpace: 'pre-wrap' }}
                  data-placeholder={t.editorPlaceholder}
                />
              </div>
              
              <div className="bg-gray-900/50 p-2 sm:p-3 flex justify-between items-center text-xs text-gray-500 border-t border-gray-800 flex-shrink-0">
                <div className="flex items-center space-x-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${charCount > 0 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                   <span>{t.autoSaving}</span>
                </div>
                <span>{charCount} {t.chars}</span>
              </div>
            </div>

            {/* Slot Iklan Bawah */}
            <div className="w-full flex-shrink-0 mt-1 bg-gray-900/30 border border-gray-800/50 border-dashed rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center text-gray-600 text-xs">
              <span className="mb-1 opacity-50 uppercase tracking-widest" style={{fontSize: '0.65rem'}}>{t.adSpace} (Bottom)</span>
              <div className="w-full max-w-[728px] h-[50px] sm:h-[90px] bg-gray-950/50 rounded flex items-center justify-center overflow-hidden">
                 <p className="opacity-40">Taruh tag &lt;ins&gt; AdSense di sini</p>
              </div>
            </div>

          </div>
        </div>
      )}

       {/* --- BAGIAN CSS ANIMASI --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateX(5px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        
        [contentEditable=true]:empty:before {
          content: attr(data-placeholder);
          color: #4b5563; 
          pointer-events: none;
          display: block;
        }

        [contentEditable=true] img:hover {
          border-color: #6366f1 !important; 
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
          opacity: 0.9;
          transition: all 0.2s ease;
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(17, 24, 39, 0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(79, 70, 229, 0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(79, 70, 229, 0.6); }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }

        @keyframes spin-reverse-slow {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-reverse-slow { animation: spin-reverse-slow 4s linear infinite; }

        @keyframes ping-fast {
          0% { transform: scale(0.8); opacity: 1; }
          80%, 100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-ping-fast { animation: ping-fast 0.8s cubic-bezier(0, 0, 0.2, 1) infinite; }

        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 2.5s linear infinite;
        }
      `}} />

      {/* --- VERCEL ANALYTICS DI SINI --- */}
      <Analytics />
      <SpeedInsights />
    </div> // Penutup div "min-h-screen"
  ); // Penutup return
} // Penutup fungsi App
