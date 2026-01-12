# 🔥 Configuração do Firebase para AgroMilk

## 📋 Passo a Passo Completo

### 1️⃣ Criar Projeto Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Nome do projeto: `AgroMilk` (ou o que preferir)
4. Desative o Google Analytics (opcional, não é necessário)
5. Clique em **"Criar projeto"**
6. Aguarde a criação (alguns segundos)

### 2️⃣ Configurar Realtime Database

1. No menu lateral, vá em **Build** → **Realtime Database**
2. Clique em **"Criar banco de dados"** ou **"Create Database"**
3. Escolha a localização:
   - **Europa:** `europe-west1` (recomendado para Portugal/Europa)
   - **EUA:** `us-central1`
4. Modo de segurança: **"Iniciar em modo de teste"** (por enquanto)
   - ⚠️ Atenção: Este modo permite leitura/escrita para todos (alterar depois)
5. Clique em **"Ativar"** ou **"Enable"**

### 3️⃣ Obter Credenciais

1. Clique no ícone de **engrenagem** ⚙️ (Settings) no menu lateral
2. Clique em **"Configurações do projeto"** / **"Project settings"**
3. Role até a seção **"Seus apps"** / **"Your apps"**
4. Clique no ícone **</>** (Web)
5. Nickname do app: `AgroMilk`
6. **NÃO** marque "Firebase Hosting"
7. Clique em **"Registrar app"** / **"Register app"**
8. **COPIE** todo o código que aparece (firebaseConfig)

### 4️⃣ Configurar no Projeto

1. Abra o ficheiro **`firebase-config.js`**
2. **Substitua** as credenciais de exemplo pelas suas:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyA...",  // Cole sua API Key aqui
    authDomain: "agromilk-xxx.firebaseapp.com",
    databaseURL: "https://agromilk-xxx-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "agromilk-xxx",
    storageBucket: "agromilk-xxx.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};
```

3. **Salve** o ficheiro

### 5️⃣ Publicar no GitHub

```bash
git add .
git commit -m "Add Firebase integration"
git push origin main
```

### 6️⃣ Testar

1. Acesse seu site: `https://josecastro29.github.io/AgroMilk/`
2. Verifique o indicador no topo:
   - ✅ **"Sincronizado"** = Funcionando perfeitamente
   - ⚠️ **"Offline"** = Sem conexão (verifique internet)
   - 🔄 **"A conectar..."** = Aguardando conexão

3. **Teste em dois dispositivos:**
   - Adicione uma vaca no dispositivo A
   - Veja ela aparecer automaticamente no dispositivo B
   - **Sincronização em tempo real!**

### 7️⃣ Configurar Segurança (IMPORTANTE!)

Após testar, configure regras de segurança:

1. No Firebase Console, vá em **Realtime Database**
2. Aba **"Rules"**
3. Substitua por:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Nota:** Para produção, você deve criar regras mais seguras. Por enquanto, isso funciona para teste.

### 8️⃣ Verificar Dados

1. No Firebase Console, vá em **Realtime Database**
2. Aba **"Data"**
3. Você verá:
   - `vacas/` - Todas as vacas cadastradas
   - `ordenhas/` - Todas as ordenhas registadas

## ✨ Funcionalidades Implementadas

### 🔄 Sincronização em Tempo Real
- Qualquer alteração em um dispositivo aparece imediatamente em todos os outros
- Não precisa atualizar a página
- Funciona offline (sincroniza quando voltar a ter internet)

### 💾 Backup Automático
- Dados são salvos no Firebase (nuvem)
- E também no LocalStorage (local) como backup
- Se Firebase falhar, usa localStorage

### 📊 Indicador de Status
- **✅ Sincronizado** - Conectado ao Firebase
- **⚠️ Offline** - Sem conexão (dados apenas locais)
- **🔄 A conectar...** - Estabelecendo conexão

## 🚨 Resolução de Problemas

### ❌ Erro: "Firebase is not defined"
- Verifique se substituiu as credenciais em `firebase-config.js`
- Limpe o cache do navegador

### ❌ Erro: "Permission denied"
- Verifique as regras de segurança no Firebase Console
- Certifique-se que está em "modo de teste"

### ❌ Dados não sincronizam
- Verifique a conexão com internet
- Olhe o console do navegador (F12) para erros
- Verifique o indicador de status no topo

## 📱 Funciona em:

✅ Computadores (Chrome, Firefox, Edge, Safari)
✅ Tablets (Android, iPad)
✅ Smartphones (Android, iOS)
✅ Múltiplos dispositivos simultaneamente

## 🎉 Pronto!

Agora sua aplicação AgroMilk tem um banco de dados central compartilhado!
Todos os dispositivos que acessarem o site terão os mesmos dados em tempo real.
