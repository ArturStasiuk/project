<?php // odpowiada za pobranie sciezek do modułów
class TOOLS{
    public function __construct(){}

    public function getPublicModules(): array
    {
        // tutaj możesz dodać logikę do pobierania ścieżek modułów
        // na przykład, możesz zwrócić tablicę z nazwami modułów i ich ścieżkami
        return [
            'module1' => '/path/to/module1',
            'module2' => '/path/to/module2',
            'module3' => '/path/to/module3',
        ];
    }


}