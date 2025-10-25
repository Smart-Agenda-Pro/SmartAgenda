# 🧨 Crash ao iniciar: `NoSuchMethodError` em Expo Modules (DocumentPicker)

Você coletou o log e encontramos o **erro raiz** (release/dev client):

    FATAL EXCEPTION: create_react_context
    Process: app.rork.barberpro_management
    java.lang.NoSuchMethodError: No virtual method getConverters()Lexpo/modules/kotlin/types/TypeConverterProvider;
      at expo.modules.documentpicker.DocumentPickerModule.definition(DocumentPickerModule.kt:134)
      ...

## 💡 Diagnóstico

`NoSuchMethodError` indica **incompatibilidade de versões binárias**
entre: - **`expo-document-picker`** (módulo Kotlin) -
**`expo-modules-core` / Kotlin Interop** (base dos módulos Expo) -
Possivelmente a versão do **Expo SDK** em uso

Em resumo: uma lib foi compilada esperando um método (`getConverters()`)
que **não existe** na versão que você tem no runtime. Isso não é
ProGuard; é **mismatch de versões**.

------------------------------------------------------------------------

## ✅ Correção Rápida (Managed/Prebuild)

> Objetivo: alinhar as versões dos módulos Expo ao **mesmo SDK** e
> reconstruir do zero.

1.  **Verifique o SDK instalado**

    ``` bash
    npx expo diagnostics
    ```

    *Anote o Expo SDK (ex.: 51, 52, ...).*

2.  **Alinhe os pacotes ao SDK com `expo install`** \> `expo install`
    escolhe versões **compatíveis** com seu SDK atual.

    ``` bash
    # alinhar o core e o document-picker
    npx expo install expo-modules-core expo-document-picker

    # (opcional) alinhar outros módulos expo que você usa
    npx expo install expo-file-system expo-clipboard expo-sharing
    ```

3.  **(Opcional) Atualize o SDK** para a versão estável mais recente
    **antes** de alinhar módulos:

    ``` bash
    npx expo upgrade
    # depois repita o passo 2 para garantir alinhamento
    npx expo install expo-modules-core expo-document-picker
    ```

4.  **Limpe e reconstrua**

    ``` bash
    rm -rf node_modules .expo .parcel-cache
    npm i  # ou yarn/pnpm

    # se você usa prebuild/bare
    npx expo prebuild --clean
    ```

5.  **Rebuild do Dev Client / APK**

    ``` bash
    # Development client (para ver stack trace in-app)
    eas build -p android --profile development
    npx expo start --dev-client

    # ou build preview/release
    eas build -p android --profile preview
    ```

6.  **Teste o lançamento**

    ``` bash
    adb -s emulator-5554 logcat -c
    adb -s emulator-5554 logcat '*:E'   # no zsh, use aspas
    adb -s emulator-5554 shell monkey -p app.rork.barberpro_management -c android.intent.category.LAUNCHER 1
    ```

------------------------------------------------------------------------

## 🔎 Se precisar manter a versão atual do SDK

Garanta que as versões **combinam com seu SDK**. Exemplos
(ilustrativos): - SDK **52** → `expo@~52.x`, `expo-modules-core@~2x.x`,
`expo-document-picker@~xx.x.x` - SDK **51** → `expo@~51.x`,
`expo-modules-core@~1x.x`, `expo-document-picker@~xx.x.x`

> Use sempre `npx expo install pacote` para pegar a **tag compatível**;
> evitar `npm i pacote@latest` puro.

Para conferir rapidamente o que está desalinhado:

``` bash
npx expo-doctor
```

Ele sugere correções automáticas.

------------------------------------------------------------------------

## 🧰 Plano B (workaround para confirmar a causa)

1.  **Desabilite a importação/uso do `expo-document-picker`**
    temporariamente (condicional por plataforma/flag):

    ``` ts
    // evite importar o módulo na inicialização; carregue sob demanda
    const pickDocument = async () => {
      const { getDocumentAsync } = await import('expo-document-picker');
      const res = await getDocumentAsync();
      return res;
    };
    ```

    Se o app **para de crashar**, confirma o mismatch nesse módulo.

2.  **Limpe o Gradle (bare ou prebuild)**

    ``` bash
    cd android && ./gradlew clean && cd -
    ```

3.  **Hermes não é o culpado** aqui, mas se quiser isolar, reconstruir
    desativando Hermes pode ajudar a encurtar o ciclo de teste.

------------------------------------------------------------------------

## 🧱 Possíveis causas que levam ao mismatch

-   Atualizou **apenas** `expo-document-picker` sem atualizar
    `expo-modules-core`.
-   Mistura de versões ao migrar de SDK (ex.: metade no SDK 51, metade
    no 52).
-   Cache/build antigos (Gradle/Metro) mantendo artefatos de APIs
    antigas.

------------------------------------------------------------------------

## 🧪 Checklists de verificação

### `package.json` coerente

-   `expo`: versão **do mesmo SDK** das libs
-   `expo-modules-core`: compatível com o SDK
-   `expo-document-picker`: instalado via `expo install`

### Babel

``` js
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['react-native-reanimated/plugin'], // se usa reanimated
};
```

### Rebuild limpo

``` bash
rm -rf node_modules .expo .parcel-cache android/ios (se for regenerar)
npm i
npx expo prebuild --clean   # quando aplicável
eas build -p android --profile development
```

------------------------------------------------------------------------

## 🧪 Comandos de teste (pós-fix)

``` bash
# logs limpos
adb -s emulator-5554 logcat -c
adb -s emulator-5554 logcat '*:E'

# lançar o app
adb -s emulator-5554 shell monkey -p app.rork.barberpro_management -c android.intent.category.LAUNCHER 1
```

Se **ainda** aparecer `NoSuchMethodError` com `expo.modules.kotlin`,
revisite os passos 1--3 e verifique se não há **lockfile** travando
versões antigas (`package-lock.json`/`yarn.lock`/`pnpm-lock.yaml`).
Apague-o e reinstale.

------------------------------------------------------------------------

## 📎 Referência do erro visto

    NoSuchMethodError: ... getConverters() in expo.modules.kotlin.objects.ObjectDefinitionBuilder
    at expo.modules.documentpicker.DocumentPickerModule.definition(DocumentPickerModule.kt:134)

Causa típica: **versões incompatíveis** entre `expo-document-picker` ↔
`expo-modules-core` ↔ SDK.

------------------------------------------------------------------------

> Pronto! Siga os passos de alinhamento e rebuild limpo. Se quiser, cole
> aqui seu `package.json` (deps `expo*`) e o output do
> `npx expo diagnostics` que eu te devolvo a matriz de versões exata
> para o seu SDK.
