# Project Setup

## VM Environment
For this project, an Arch Linux VM has been chosen as a working environment.

### Acquire the ISO
1. Go [here](https://archlinux.org/download/).
2. Scroll down to `HTTP Direct Downloads`.
3. Choose your mirror.

>[!NOTE]
>I used `geo.mirror.pkgbuild.com` under the `Worldwide` section.

4. Follow the official [Installation Guide](https://wiki.archlinux.org/title/Installation_guide).

### Post-Installation & Dependencies
Once your Arch Linux system is booted and your user is configured with `sudo` privileges, install the necessary development packages:

```bash
# Update system repositories
sudo pacman -Syu

# Install build tools, runtime environments, and mobile utilities
sudo pacman -S --needed \
    base-devel \
    git \
    curl \
    wget \
    nodejs \
    npm \
    jdk17-openjdk \
    android-tools \
    zsh
```

#### Set Java Environment
Ensure OpenJDK 17 is active for Android builds:

```bash
sudo archlinux-java set java-17-openjdk
```

#### Filesystem Watcher (Optional)
Expo and Metro bundler work more reliably with `watchman`. You can install it via an AUR helper (e.g., `yay` or `paru`):

```bash
yay -S watchman-bin
```

## Project Bootstrap

### Initialize the Expo Scaffold
Because this repository already contains documentation, a Makefile, and configuration files, scaffold into a temporary directory to avoid overwrite conflicts, then transfer the generated files:

```bash
# Generate the blank template in a temporary folder
npx create-expo-app@latest temp-app --template blank

# Copy the scaffolded files (package.json, App.js, etc.) into the repository root
cp -r temp-app/. .

# Clean up the temporary directory
rm -rf temp-app
```

### Install Project Dependencies
Now that `package.json` exists in the repository root, install the navigation stack packages:

```bash
npx expo install \
    @react-navigation/native \
    @react-navigation/native-stack \
    react-native-screens \
    react-native-safe-area-context
```

From this point forward, dependencies can be managed or reinstalled at any time using:

```bash
make install
```

### Repository Dependencies
Clone the repository and install the project dependencies via `npm` or the provided `Makefile`:

```bash
make install
# or
npm install
```

### Initializing from Scratch (Reference Only)
If reproducing the base scaffolding from scratch without existing files:

```bash
npx create-expo-app@latest swifty-companion --template blank
cd swifty-companion

# Install mobile navigation stack dependencies
npx expo install \
    @react-navigation/native \
    @react-navigation/native-stack \
    react-native-screens \
    react-native-safe-area-context
```

## Environment Variables Configuration
The application requires OAuth2 credentials from the 42 API.

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Populate `.env` with your 42 Intranet API UID and Secret:
   ```env
   EXPO_PUBLIC_FT_CLIENT_ID=your_client_id_here
   EXPO_PUBLIC_FT_CLIENT_SECRET=your_client_secret_here
   ```

>[!WARNING]
>Never commit the `.env` file to version control. The repository `.gitignore` is preconfigured to omit it.

## Running the Application
Launch the development server:

```bash
make
# or
npx expo start
```

* Press `w` to inspect the UI directly in a desktop browser.
* Scan the displayed QR code using the **Expo Go** application on an Android or iOS device connected to the same local network.
* Run `make tunnel` (`npx expo start --tunnel`) if the development host and mobile device are on isolated or restricted networks.
