# FitStormMK
FitStorm base using meteor kitchen

meteor-kitchen fitstorm.yaml ./build/fitstorm

cd ./build/fitstorm/
meteor

localhost:3000

To build to production:

```bash
npm install -g mupx
meteor-kitchen fitstorm.yaml ./build/fitstorm
cd build/fitstorm
mupx deploy
```
