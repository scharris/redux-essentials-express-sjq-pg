with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    nodejs
    nodePackages.typescript
    openjdk11
    maven
    postgresql_13
  ];
  shellHook = ''
    echo Welcome to the ts-react-redux-express-skeleton project.
    export PGPORT=5433
    echo PGPORT set to $PGPORT
  '';
}
