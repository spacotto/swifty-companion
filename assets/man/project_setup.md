# Project Setup

This guide details the step-by-step process of bootstrapping and configuring the development environment for the **Swifty-Companion** mobile application. It covers everything from provisioning an Arch Linux guest virtual machine with standard low-level build tools and OpenJDK 17 to handling disk partitioning, extracting the Expo baseline, installing the React Navigation stack, and configuring OAuth2 credentials for the 42 Intranet API.

## VM Environment
For this project, an Arch Linux VM has been chosen as a working environment[cite: 6].

### Acquire the ISO
1. Go [here](https://archlinux.org/download/)[cite: 6].
2. Scroll down to `HTTP Direct Downloads`[cite: 6].
3. Choose your mirror[cite: 6].

>[!NOTE]
>I used `geo.mirror.pkgbuild.com` under the `Worldwide` section[cite: 6].

4. Follow the official [Installation Guide](https://wiki.archlinux.org/title/Installation_guide)[cite: 6].

### Post-Installation & Dependencies
Once your Arch Linux system is booted and your user is configured with `sudo` privileges, install the necessary development packages[cite: 6]:

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
    zsh \
    cloud-guest-utils
```

#### Set Java Environment
Ensure OpenJDK 17 is active for Android builds[cite: 6]:

```bash
sudo archlinux-java set java-17-openjdk
```

#### Filesystem Watcher (Optional)
Expo and Metro bundler work more reliably with `watchman`[cite: 6]. You can install it via an AUR helper (e.g., `yay` or `paru`)[cite: 6]:

```bash
yay -S watchman-bin
```

### Storage Expansion (Post-Install)
If the installed root partition does not automatically allocate the full virtual disk size, expand partition 2 and resize the filesystem online:

```bash
# Expand partition 2 on /dev/sda
sudo growpart /dev/sda 2

# Resize ext4 filesystem to fill expanded space
sudo resize2fs /dev/sda2

# Verify available space
df -h /
```

## Project Bootstrap

### 1. Initialize the Expo Scaffold
Because this repository already contains configuration and documentation files, extract the official blank template archive directly to prevent parser or overwrite issues:

```bash
# Download official template package archive
npm pack expo-template-blank@57.0.25

# Extract archive directly into current directory
tar -xzf expo-template-blank-57.0.25.tgz --strip-components=1

# Clean up tarball and unnecessary files
rm expo-template-blank-57.0.25.tgz
rm -rf gitignore LICENSE
```

### 2. Install Project Dependencies
Once `package.json` is in place, install base dependencies followed by the navigation stack:

```bash
# Install core packages
npm install

# Install navigation dependencies
npx expo install \
    @react-navigation/native \
    @react-navigation/native-stack \
    react-native-screens \
    react-native-safe-area-context
```

From this point forward, dependencies can be managed or restored at any time using[cite: 6]:

```bash
make install
```

## Environment Variables Configuration
The application requires OAuth2 credentials from the 42 API[cite: 6].

1. Copy the example file[cite: 6]:
   ```bash
   cp .env.example .env
   ```

2. Populate `.env` with your 42 Intranet API UID and Secret[cite: 6]:
   ```env
   EXPO_PUBLIC_FT_CLIENT_ID=your_client_id_here
   EXPO_PUBLIC_FT_CLIENT_SECRET=your_client_secret_here
   ```

>[!WARNING]
>Never commit the `.env` file to version control[cite: 6]. The repository `.gitignore` is preconfigured to omit it[cite: 6].

## Running the Application
Launch the development server[cite: 6]:

```bash
make
# or
npx expo start
```

* Press `w` to inspect the UI directly in a desktop browser[cite: 6].
* Scan the displayed QR code using the **Expo Go** application on an Android or iOS device connected to the same local network[cite: 6].
* Run `make tunnel` (`npx expo start --tunnel`) if the development host and mobile device are on isolated or restricted networks[cite: 6].
