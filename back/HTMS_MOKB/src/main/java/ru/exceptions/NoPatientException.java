package ru.exceptions;

public class NoPatientException extends RuntimeException {

    public NoPatientException(String message){
        super(message);
    }

}
