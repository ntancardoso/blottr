# blottr
Ionic 2 implementation of [SafeCities-Ionic](https://github.com/eabquina/safecities-ionic)

### Installation
```
git clone https://github.com/ntancardoso/blottr.git
```

```
cd blottr
```

```
npm install
```

```
ionic state restore
```

(if not yet installed)
```
typings install google.maps --global
```

Verify platforms/android/AndroidManifest.xml
```
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
```    


### Start

```
ionic serve
```


## Dependencies

* **@Angular:** 2.0.0-rc.3
* **Ionic:** 2.0.0-beta.10
