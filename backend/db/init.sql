-- Asegura que la base de datos use UTF-8
CREATE DATABASE IF NOT EXISTS `clinica-db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `clinica-db`;

-- Tabla paciente
CREATE TABLE paciente (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    apellido VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla tipoEstudio
CREATE TABLE tipo_estudio (
    id_tipo_estudio INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) UNIQUE NOT NULL
);

-- Tabla estudio
CREATE TABLE estudio (
    id_estudio INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    id_tipo_estudio INT NOT NULL,
    FOREIGN KEY (id_tipo_estudio) REFERENCES tipo_estudio(id_tipo_estudio)
);

-- Tabla paciente_estudio
CREATE TABLE paciente_estudio (
    id_paciente_estudio INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_estudio INT NOT NULL,
    fecha_realizacion DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES paciente(id_paciente),
    FOREIGN KEY (id_estudio) REFERENCES estudio(id_estudio)
);

CREATE TABLE turno(
    id_turno INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE tecnicos (
    id_tecnico INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    id_turno INT NOT NULL,
    FOREIGN KEY (id_turno) REFERENCES turno (id_turno)
);

CREATE VIEW turno_tecnico AS 
SELECT 
    t.id_tecnico,
    t.nombre AS nombre_tecnico,
    t.apellido AS apellido_tecnico,
    t.dni AS dni_tecnico,
    tu.nombre AS nombre_turno
FROM
    tecnicos AS t
JOIN    
    turno AS tu ON t.id_turno = tu.id_turno;

CREATE VIEW estudio_con_tipo AS
SELECT
    e.id_estudio,
    e.descripcion AS nombre_estudio,
    te.descripcion AS nombre_tipo_estudio,
    e.id_tipo_estudio
FROM
    estudio AS e
JOIN
    tipo_estudio AS te ON e.id_tipo_estudio = te.id_tipo_estudio;

-- Datos iniciales para tipoEstudio
INSERT INTO tipo_estudio (descripcion) VALUES ('Radiografia'), ('Tomografia'), ('Radioscopia');

-- Datos iniciales para estudios de Radiografía (asumiendo id_tipo_estudio=1 para Radiografía)
INSERT INTO estudio (descripcion, id_tipo_estudio) VALUES
('Radiografia de Torax', 1),
('Radiografia de Craneo', 1),
('Radiografia de Columna Cervical', 1),
('Radiografia de Columna Dorsal', 1),
('Radiografia de Columna Lumbar', 1),
('Radiografia de Pelvis', 1),
('Radiografia de Hombro', 1),
('Radiografia de Codo', 1),
('Radiografia de Muneca', 1),
('Radiografia de Mano', 1),
('Radiografia de Cadera', 1),
('Radiografia de Rodilla', 1),
('Radiografia de Tobillo', 1),
('Radiografia de Pie', 1),
('Radiografia de Abdomen', 1),
('Radiografia de Senos Paranasales', 1),
('Radiografia de Clavicula', 1),
('Radiografia de Escapula', 1),
('Radiografia de Femur', 1),
('Radiografia de Tibia y Perone', 1),
('Radiografia de Costillas', 1),
('Radiografia de Esternon', 1),
('Radiografia de Articulacion Temporomandibular (ATM)', 1),
('Radiografia de Orbitas', 1),
('Radiografia de Silla Turca', 1);

-- Datos iniciales para estudios de Tomografia (asumiendo id_tipo_estudio=2 para Tomografia)
INSERT INTO estudio (descripcion, id_tipo_estudio) VALUES
('Tomografia de Craneo', 2),
('Tomografia de Senos Paranasales', 2),
('Tomografia de Orbitas', 2),
('Tomografia de Cuello', 2),
('Tomografia de Torax', 2),
('Tomografia de Abdomen y Pelvis', 2),
('Tomografia de Columna Cervical', 2),
('Tomografia de Columna Dorsal', 2),
('Tomografia de Columna Lumbar', 2),
('Tomografia de Hombro', 2),
('Tomografia de Codo', 2),
('Tomografia de Muneca', 2),
('Tomografia de Mano', 2),
('Tomografia de Cadera', 2),
('Tomografia de Rodilla', 2),
('Tomografia de Tobillo', 2),
('Tomografia de Pie', 2),
('Tomografia de Angiografia (Angio-TC)', 2),
('Tomografia de Biopsia Guiada por TC', 2);

-- Datos iniciales para estudios de Radioscopia (asumiendo id_tipo_estudio=3 para Radioscopia)
INSERT INTO estudio (descripcion, id_tipo_estudio) VALUES
('Colangiografia por Radioscopia', 3),
('Colangiopancreatografia Retrograda Endoscopica (CPRE) por Radioscopia', 3),
('Radioscopia para Procedimientos de Traumatologia', 3),
('Radioscopia para Procedimientos de Urologia', 3),
('Radioscopia para Procedimientos de Neurologia', 3),
('Radioscopia de Control de Vias Biliares', 3),
('Radioscopia para Posicionamiento de Cateteres', 3),
('Radioscopia para Estudios de Deglucion (Videofluoroscopia)', 3),
('Radioscopia para Procedimientos Vasculares', 3);