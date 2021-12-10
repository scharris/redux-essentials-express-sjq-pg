with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    nodejs
    nodePackages.typescript
    openjdk11
    maven
  ];
  shellHook = ''
    echo Welcome to the ts-react-redux-express-skeleton project.
  '';
}
