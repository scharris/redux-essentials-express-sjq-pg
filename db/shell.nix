with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    postgresql_13
  ];

  shellHook = ''
    echo Welcome to the postgres shell.
    export PGPORT=5433
    echo PGPORT set to $PGPORT
  '';

}
