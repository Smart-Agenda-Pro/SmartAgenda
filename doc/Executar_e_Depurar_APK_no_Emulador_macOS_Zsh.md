# 📘 Guia Completo: Instalar, Abrir e Depurar um APK no Emulador Android (macOS + Zsh)

## 🧠 Contexto

-   **Emulador:** `emulator-5554`
-   **APK no emulador:**
    `/sdcard/Download/application-6c666781-a156-4ee1-8952-61fd58e9829c.apk`
-   **Pacote do app:** `app.rork.barberpro_management`
-   **Terminal:** Zsh (padrão do macOS)

------------------------------------------------------------------------

## ⚙️ 1. Confirmar ADB e conexão

``` bash
adb version
adb devices
```

Deve listar algo como:

    List of devices attached
    emulator-5554   device

------------------------------------------------------------------------

## 📂 2. Mover o APK para a pasta permitida

Por segurança, o Android bloqueia instalação de `/sdcard/Download`.\
Por isso, movemos o arquivo para `/data/local/tmp`:

``` bash
adb -s emulator-5554 shell cp /sdcard/Download/application-6c666781-a156-4ee1-8952-61fd58e9829c.apk /data/local/tmp/app.apk
adb -s emulator-5554 shell ls -lh /data/local/tmp/app.apk
```

Saída esperada:

    -rwxrwx--- 1 shell shell 70M 2025-10-24 /data/local/tmp/app.apk

------------------------------------------------------------------------

## 📦 3. Instalar o APK

``` bash
adb -s emulator-5554 shell pm install -r /data/local/tmp/app.apk
```

Saída:

    Success

------------------------------------------------------------------------

## 🧩 4. Confirmar o pacote do app

``` bash
adb -s emulator-5554 shell cmd package list packages -3 | tail -n 10
```

Exemplo de saída:

    package:app.rork.barberpro_management

------------------------------------------------------------------------

## 🚀 5. Abrir o app

``` bash
adb -s emulator-5554 shell monkey -p app.rork.barberpro_management -c android.intent.category.LAUNCHER 1
```

Isso executa o app pela **Activity principal**.\
Se ele fechar logo em seguida, significa que houve **crash em tempo de
execução** --- agora vem a parte importante.

------------------------------------------------------------------------

## 🪲 6. Ver logs de erro (Zsh seguro)

No Zsh, o caractere `*` precisa ser **escapado** com aspas ou barra
invertida.\
Escolha uma das opções abaixo:

### ✅ Opção A --- Usar aspas simples

``` bash
adb -s emulator-5554 logcat '*:E'
```

### ✅ Opção B --- Usar barra invertida

``` bash
adb -s emulator-5554 logcat \*:E
```

Ambos funcionam! Isso mostra **somente erros** (`E = Error`).

Quando o app crashar, você verá algo como:

    E/AndroidRuntime(12345): FATAL EXCEPTION: main
    E/AndroidRuntime(12345): Process: app.rork.barberpro_management, PID: 12345
    E/AndroidRuntime(12345): java.lang.NullPointerException: Attempt to invoke ...

------------------------------------------------------------------------

## 💾 7. Salvar logs do crash

``` bash
adb -s emulator-5554 logcat -d > ~/Desktop/crash_log.txt
```

Depois abra o arquivo no VS Code e procure por:

    FATAL EXCEPTION

------------------------------------------------------------------------

## 🔍 8. Dicas adicionais

  -------------------------------------------------------------------------------------------------------
  Situação                               Solução
  -------------------------------------- ----------------------------------------------------------------
  `INSTALL_FAILED_VERSION_DOWNGRADE`     Desinstale o app antigo:
                                         `adb -s emulator-5554 uninstall app.rork.barberpro_management`

  `INSTALL_FAILED_UPDATE_INCOMPATIBLE`   App assinado com chave diferente → desinstale antes.

  Quer ver todos os pacotes?             `adb -s emulator-5554 shell cmd package list packages -3`

  Quer ver warnings também?              `adb -s emulator-5554 logcat '*:W'`

  Quer limpar o log antes de rodar de    `adb -s emulator-5554 logcat -c`
  novo?                                  
  -------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 🧠 9. Resumo rápido

  ---------------------------------------------------------------------------------------------------------------
  Etapa               Comando principal
  ------------------- -------------------------------------------------------------------------------------------
  Copiar APK          `adb shell cp /sdcard/Download/... /data/local/tmp/app.apk`

  Instalar            `adb shell pm install -r /data/local/tmp/app.apk`

  Abrir               `adb shell monkey -p app.rork.barberpro_management -c android.intent.category.LAUNCHER 1`

  Ver logs (Zsh       `adb logcat '*:E'`
  seguro)             

  Salvar logs         `adb logcat -d > ~/Desktop/crash_log.txt`
  ---------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

> 🔧 Pronto! Esse guia cobre **todo o ciclo de instalação, execução e
> depuração** do seu APK dentro do emulador Android no macOS com Zsh.
