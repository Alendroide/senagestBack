-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: senagest
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ficha`
--

DROP TABLE IF EXISTS `ficha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ficha` (
  `codigo` int NOT NULL,
  `programaId` int NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `Ficha_programaId_fkey` (`programaId`),
  CONSTRAINT `Ficha_programaId_fkey` FOREIGN KEY (`programaId`) REFERENCES `programa` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ficha`
--

LOCK TABLES `ficha` WRITE;
/*!40000 ALTER TABLE `ficha` DISABLE KEYS */;
INSERT INTO `ficha` VALUES (2846103,1),(2900810,1);
/*!40000 ALTER TABLE `ficha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulo`
--

DROP TABLE IF EXISTS `modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icono` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Book',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Modulo_nombre_key` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulo`
--

LOCK TABLES `modulo` WRITE;
/*!40000 ALTER TABLE `modulo` DISABLE KEYS */;
INSERT INTO `modulo` VALUES (1,'Modulos','Administración global de módulos','Server'),(2,'Permisos','Permite administrar y asignar permisos','Ban'),(3,'Roles','Modulo de creación y administración de roles','GraduationCap'),(4,'Usuarios','Permite asignación de roles y administración de usuarios en general','UsersRound');
/*!40000 ALTER TABLE `modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('read','write','update') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'read',
  `rutaId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Permiso_rutaId_fkey` (`rutaId`),
  CONSTRAINT `Permiso_rutaId_fkey` FOREIGN KEY (`rutaId`) REFERENCES `rutafront` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES (1,'Crear Módulos','Permite la creación de módulos nuevos en el sistema','write',1),(2,'Leer Módulos','Permite obtener los módulos existentes en el sistema','read',1),(3,'Crear Permisos','Permite crear permisos a los módulos','write',2),(4,'Leer Permisos','Permite obtener todos los permisos existentes','read',2),(5,'Asignar Permiso','Permite asignar un permiso a un rol','write',3),(6,'Crear Rol','Permite crear nuevos roles en el sistema','write',4),(7,'Leer Roles','Permite obtener todos los roles del sistema','read',4),(8,'Crear Usuario','Creación de nuevos usuarios','write',5),(9,'Leer Usuarios','Permite enlistar a cada usuario del sistema categorizado en roles','read',5);
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programa`
--

DROP TABLE IF EXISTS `programa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviacion` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programa`
--

LOCK TABLES `programa` WRITE;
/*!40000 ALTER TABLE `programa` DISABLE KEYS */;
INSERT INTO `programa` VALUES (1,'Análisis y Desarrollo de Software','ADSO');
/*!40000 ALTER TABLE `programa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icono` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'User',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador','Acceso total al sistema','ShieldUser'),(2,'Aprendiz','Estudiante del CGDSS','User'),(13,'Instructor','Encargado de guiar los procesos formativos de los aprendices','Book'),(14,'Coordinador','Responsable de coordinar las actividades académicas y administrativas','Home'),(15,'Bienestar','Gestiona programas de apoyo y bienestar para aprendices y funcionarios','ShieldUser'),(16,'Gestor TIC','Administra los sistemas tecnológicos del centro de formación','Server'),(17,'Planeación','Encargado de la planificación y evaluación institucional','AppWindow'),(18,'Gestor Ambiental','Lidera estrategias de sostenibilidad y medio ambiente','Atom'),(19,'Apoyo Admin','Brinda soporte en procesos administrativos','AlignEndHorizontal'),(20,'Gestor Emprende','Fomenta la creación de ideas de negocio y proyectos productivos','BadgeDollarSign'),(21,'SST','Promueve la seguridad y bienestar laboral en el centro','Activity'),(22,'Control Acceso','Supervisa el ingreso y la seguridad en las instalaciones','Ban');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolpermiso`
--

DROP TABLE IF EXISTS `rolpermiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rolpermiso` (
  `permisoId` int NOT NULL,
  `rolId` int NOT NULL,
  `valor` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`permisoId`,`rolId`),
  KEY `RolPermiso_rolId_fkey` (`rolId`),
  CONSTRAINT `RolPermiso_permisoId_fkey` FOREIGN KEY (`permisoId`) REFERENCES `permiso` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `RolPermiso_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `rol` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolpermiso`
--

LOCK TABLES `rolpermiso` WRITE;
/*!40000 ALTER TABLE `rolpermiso` DISABLE KEYS */;
INSERT INTO `rolpermiso` VALUES (1,1,1),(1,2,0),(2,1,1),(2,2,0),(3,1,1),(4,1,1),(4,2,1),(5,1,1),(6,1,1),(7,1,1),(8,1,1),(8,22,1),(9,1,1),(9,22,1);
/*!40000 ALTER TABLE `rolpermiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutafront`
--

DROP TABLE IF EXISTS `rutafront`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutafront` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ruta` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `moduloId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `RutaFront_moduloId_fkey` (`moduloId`),
  CONSTRAINT `RutaFront_moduloId_fkey` FOREIGN KEY (`moduloId`) REFERENCES `modulo` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutafront`
--

LOCK TABLES `rutafront` WRITE;
/*!40000 ALTER TABLE `rutafront` DISABLE KEYS */;
INSERT INTO `rutafront` VALUES (1,'home','Administrar módulos',1),(2,'home','Administrar permisos',2),(3,'asign','Asignar permisos',2),(4,'home','Administrar roles',3),(5,'home','Administrar usuarios',4);
/*!40000 ALTER TABLE `rutafront` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identificacion` bigint NOT NULL,
  `primerNombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `segundoNombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primerApellido` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `segundoApellido` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fichaId` int DEFAULT NULL,
  `rolId` int DEFAULT NULL,
  `fechaNacimiento` datetime(3) NOT NULL,
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'defaultpfp.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Usuario_identificacion_key` (`identificacion`),
  UNIQUE KEY `Usuario_correo_key` (`correo`),
  KEY `Usuario_fichaId_fkey` (`fichaId`),
  KEY `Usuario_rolId_fkey` (`rolId`),
  CONSTRAINT `Usuario_fichaId_fkey` FOREIGN KEY (`fichaId`) REFERENCES `ficha` (`codigo`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Usuario_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `rol` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,1079534351,'Luis','Alejandro','Bonilla','Echeverri','pepe@gmail.com','$2b$10$g5nHMpmQXtMlFwG3paml3.03kOXSgnSwqH/gG63V3qIMQFyVcP4E6',2846103,1,'2005-02-06 17:00:00.000','defaultpfp.png'),(2,1070598678,'Estefany','Daniela','Parada','Escalante','kesito@gmail.com','$2b$10$Et6e/Saehq06WLeS8THpEujK0etzych9DFBy29Qib8eZnUOd1mzqy',2900810,2,'2007-11-11 23:00:00.000','defaultpfp.png'),(3,1913539615,'Sandrine','Wilmer','Reichert','Kassulke','Ava.Zieme89@hotmail.com','$2b$10$WU4fMQeS8FAstrXBEVR7ye4bbauGgSPKIYayBK75BS0JGKrFOXaGe',2846103,NULL,'2025-05-07 15:23:52.418','defaultpfp.png'),(4,1030999089,'Vida','Hoyt','Pagac','Hackett','Katelynn.Hahn@yahoo.com','$2b$10$rDtVi.iEZ/P8LHJmlgGkQuK7ohiGFe.VNetwJA2lQI6e0ZrvDJ8bO',2846103,NULL,'2025-05-07 15:23:53.603','defaultpfp.png'),(5,2146362440,'Kristoffer','Presley','Abshire','Gibson','Esmeralda69@gmail.com','$2b$10$2h3vH4P3gtxi0rFPOB.vdOko2E1FgPlKivtc7iI/KEHERpWJULk7.',2846103,NULL,'2025-05-07 15:23:54.623','defaultpfp.png'),(6,2014007332,'Maynard','Tony','Rolfson','O\'Hara','Levi_Kirlin@yahoo.com','$2b$10$zsYj8P0.IDeIARrV5TM5HOVn8Gkj9qvASB8aLmCDOyKA/b8IBVu0C',2846103,NULL,'2025-05-07 15:23:55.550','defaultpfp.png'),(7,1739216630,'Lois','Andreanne','Rippin','Lindgren','Koby.Stanton56@yahoo.com','$2b$10$bcvUD.nPgqMcH7XWWQUETOslih1U9jJjVmskeeCWqDlF574Sek4mq',2846103,NULL,'2025-05-07 15:23:56.449','defaultpfp.png'),(8,1031068027,'Angelica','Axel','Ortiz','Rodriguez','Presley60@gmail.com','$2b$10$ry1r7NCy0Asx7G/UGzpXiOC4POSrHrfITOGObHoDK27mwVNgUoVVS',2846103,NULL,'2025-05-07 15:23:57.366','defaultpfp.png'),(9,2114302693,'Eveline','Juston','Beatty','Aufderhar','Isabella98@gmail.com','$2b$10$b/Pjmh4Q7JTx1t7ZYIMH6OUN5S1acACxcEgGX5YIzWzmxpWwz053e',2846103,NULL,'2025-05-07 15:23:58.212','defaultpfp.png'),(10,2059711025,'Zora','Berenice','Miller','Zulauf','Ivory11@hotmail.com','$2b$10$dYO4S3UmCGUF0KdoCONaAODzD3T1dZhfztG.j5YO3agvw0nzXqPXC',2846103,NULL,'2025-05-07 15:23:59.091','defaultpfp.png'),(11,1449853613,'Nelson','Hilario','Okuneva','Green','Mac21@hotmail.com','$2b$10$jr6BGVW0ka9d3JJhhMMxBeIBcAww4Tym7pr2GW.RnTJ/t33YHG17i',2846103,NULL,'2025-05-07 15:23:59.991','defaultpfp.png'),(12,1549462195,'Pearlie','Cecilia','Turcotte','Bechtelar','Jerry.Reichel@gmail.com','$2b$10$TAQxB.uW6Uya5ksXELluYOs0Zz.zDUYHCma0ix6.Buh6CL16msGoa',2846103,NULL,'2025-05-07 15:24:00.872','defaultpfp.png'),(13,1489077565,'Jerrod','Wilfred','Haag','Hegmann','Leopold.Stroman89@yahoo.com','$2b$10$4twq3q/WHxk7v20U1yLwBOKk7KITxEzTbjd6hp0mPFmyDbwYccf4i',2846103,NULL,'2025-05-07 15:24:01.808','defaultpfp.png'),(14,2072602020,'Garett','Henderson','DuBuque','Quitzon','Orie64@hotmail.com','$2b$10$jW2gQhEUNGswtcBlJOT05.2XCdgOadLkaLKNoSO3uqedSEkuEIizK',2846103,NULL,'2025-05-07 15:24:02.559','defaultpfp.png'),(15,1421779025,'Edyth','August','Boyle','Kozey','Arch.Volkman30@gmail.com','$2b$10$f6nu9b/zsKP.bq65fVhTcO9vf43hjLSuVNpAUzy1lyjZ7K3DhOZX.',2846103,NULL,'2025-05-07 15:24:03.387','defaultpfp.png'),(16,1045186392,'Griffin','Abe','Quitzon','Watsica','Zachary_Harber30@yahoo.com','$2b$10$58N7CxABsnyMDxnm53bdreHdtLOP88lnUdlFK4SC6Qiagq1Q7hwxy',2846103,NULL,'2025-05-07 15:24:04.195','defaultpfp.png'),(17,1711564722,'Angelica','Dwight','Hickle','Cruickshank','Griffin_Haag35@gmail.com','$2b$10$rFsQIOR9sl1eXQ5iNBz1c.CVbmzOgmFFb4DY2zOT3I9z1znrItQNi',2846103,NULL,'2025-05-07 15:24:05.036','defaultpfp.png'),(18,1800263317,'Alia','Kadin','Mosciski','Powlowski','Anabelle.Hermiston37@hotmail.com','$2b$10$jlv1vRb22JR.mn8Rmx9XUuQnMA2IBtWxK8y.U/n1aWA83QToreVSa',2846103,NULL,'2025-05-07 15:24:05.953','defaultpfp.png'),(19,1307150053,'Myles','Name','Botsford','Carter','Claire_Stehr84@gmail.com','$2b$10$xmeBMhUmJSo0OesSjr1kOOKKuH/tQjEJjdhUXO1rAHc1.QVWz/I.6',2846103,NULL,'2025-05-07 15:24:06.778','defaultpfp.png'),(20,1151181942,'Raoul','Tierra','Watsica','Hamill','Brooke_Greenholt@yahoo.com','$2b$10$P6yHZ3Lx8yUs42Xt/7YSguu1EjjLavfrHR/VHUXvVP0.5RRsAewIG',2846103,NULL,'2025-05-07 15:24:07.580','defaultpfp.png'),(21,1851639043,'Lesley','Frederick','Huels','Hyatt','Helmer44@gmail.com','$2b$10$wB35PQVVQsgvWPoRgfQ8x.nT7VZMAlFCGec0sLogKu8IVdXDqnn9q',2846103,NULL,'2025-05-07 15:24:08.383','defaultpfp.png'),(22,1689240367,'Wava','Brandyn','Wiegand','Runolfsdottir','Francis48@yahoo.com','$2b$10$DkBMdKOsuiCEWpzGJIWKHO4iM2gMZtrwdloLHyq0UNiCT25f8pg6.',2846103,NULL,'2025-05-07 15:24:09.224','defaultpfp.png'),(23,1484506114,'Earl','Lucio','Schimmel','Bergnaum','Mellie.Olson41@yahoo.com','$2b$10$J9Z.tYsH9InyAzGVs9n2tupusG6g.wF8zZE3KnTpvt9t0NAzh06Ua',2846103,NULL,'2025-05-07 15:24:10.059','defaultpfp.png'),(24,1421514001,'Jadyn','Sarai','Mitchell','Smitham','Jeanette.Nikolaus@gmail.com','$2b$10$VjsfkqGwkaaIn3QKmC31CuUuJlz4TWK5X61qkTtClc2Fa0JgkEYky',2846103,NULL,'2025-05-07 15:24:10.890','defaultpfp.png'),(25,1357646376,'Rowland','Dortha','Schneider','Brakus','Karelle83@hotmail.com','$2b$10$/nFndqUMsV.f75zbmt1dAeOwbkJltM6ZVipIPBbPmYquKPcb4lc/q',2846103,NULL,'2025-05-07 15:24:11.691','defaultpfp.png'),(26,1461369028,'Warren','Lilla','Bauch','Gusikowski','Dorothy_Schmidt@gmail.com','$2b$10$LASFBW9qQyEN58FK0aHyL.NAlfoPfXMixlw2dArdryp1EG6dTgXEq',2846103,NULL,'2025-05-07 15:24:12.537','defaultpfp.png'),(27,1513176043,'Rosalee','Mohammed','Feeney','Franecki','Jackeline83@yahoo.com','$2b$10$hbdyRuguZ1tCeCzhgkuSr.mBInKvz2oB5Vh6QrmXI05EsaQtL4KPG',2846103,NULL,'2025-05-07 15:24:13.379','defaultpfp.png'),(28,1452632384,'Forrest','Romaine','Hagenes','Feil','Odell_Stamm@yahoo.com','$2b$10$ZdLa2JvGGn8mYTNlpegSwOnGxfprG83T.voqUwlVAWzoWKYoemp4y',2846103,NULL,'2025-05-07 15:24:14.231','defaultpfp.png'),(29,1926824439,'Junius','Kaylah','Kuvalis','Tromp','Lance.Friesen@yahoo.com','$2b$10$M61MgF5SOVNkPa.FY8cE2.8fBQKHJ8VwCOQ5k2reDoZotHLC.B7IG',2846103,NULL,'2025-05-07 15:24:15.280','defaultpfp.png'),(30,1187253890,'Estel','Maci','Lubowitz','Rempel','Maybelle_Runte@yahoo.com','$2b$10$2u8dNJj2gIxtw6WjswplVeSrRaOnDhFEGwaf90IDovp5nrpNbg00C',2846103,NULL,'2025-05-07 15:24:16.123','defaultpfp.png'),(31,1712373947,'Jena','Kirk','Anderson','Zulauf','Price.Olson27@gmail.com','$2b$10$lMxCPyNSRK9qx3Ykyobtae79uFAd.PLwqnTYrA9tMf1MFUYJIT0aa',2846103,NULL,'2025-05-07 15:24:16.922','defaultpfp.png'),(32,1064864479,'Catalina','Keegan','Becker','Legros','Edgardo_Erdman@hotmail.com','$2b$10$x5zKposoJtCrt5lhobjR..LLc9gAXvjsQGMhS.2h7EdzSrSvB/0Ai',2846103,NULL,'2025-05-07 15:24:17.943','defaultpfp.png'),(33,1330471213,'Reid','Jamel','Deckow','Champlin','Dorothy_Bernhard@yahoo.com','$2b$10$BjMFbJLsjy7utTdfXAaCaOivVon533PLG/qs7d8cToJThXJYDYHrq',2846103,NULL,'2025-05-07 15:24:18.961','defaultpfp.png'),(34,1493071415,'Ignacio','Margarita','Kling','Jakubowski','Alvis.Christiansen@yahoo.com','$2b$10$TPVIp36wccw/jC5Q/AvHwO.f1c5W9WMrnoS/SMm/JwugVnrbCkH0K',2846103,NULL,'2025-05-07 15:24:19.747','defaultpfp.png'),(35,1082991889,'Hiram','Iva','Bernhard','Okuneva','Cordia49@yahoo.com','$2b$10$pHYSXVp/akw/Ktw7YRYEhOAIOLwcxAm3jXNbVeMUyfQD43v1TYy.u',2846103,NULL,'2025-05-07 15:24:20.546','defaultpfp.png'),(36,1192882676,'Raleigh','Margarett','Ferry','Luettgen','Nona.Fisher@yahoo.com','$2b$10$xL9JR8vWievzmfGQuE0kxuHaKyCEbkNZq1WoFi2NvTjXm.VWFyzx.',2846103,NULL,'2025-05-07 15:24:21.322','defaultpfp.png'),(37,1390012758,'Cyril','Nichole','Kling','Sawayn','Amelie.Spinka74@yahoo.com','$2b$10$rlbHKwCAj78MNVY37cHAl.me4.XuZfQg16JG6A6pd00cYfhZX4LS6',2846103,NULL,'2025-05-07 15:24:22.023','defaultpfp.png'),(38,1550584427,'Saul','Magnolia','Reilly','Huel','Gabe.Bergnaum18@gmail.com','$2b$10$CLsBEndM/3zImuYMFtyc.uyHPwi3O7gT5gU2ucSCPLsBQCZ5/MjtC',2846103,NULL,'2025-05-07 15:24:22.858','defaultpfp.png'),(39,1893879856,'Yasmine','Humberto','Kling','Pacocha','Aliza_Littel@yahoo.com','$2b$10$j8Dt30Y05ojC/uqKX/TLBuRO0rbZTq4i2xlV9b0ifaRY7akOm5nhS',2846103,NULL,'2025-05-07 15:24:23.650','defaultpfp.png'),(40,1700178095,'Julianne','Sherwood','Bartoletti','Nicolas','Lavonne_Ritchie73@gmail.com','$2b$10$ijgUDDxxsUqKp3Peg3azIuvzQzdeysr245w6W5BOqEdrDDoFPOvCi',2846103,NULL,'2025-05-07 15:24:24.350','defaultpfp.png'),(41,1007517248,'Granville','Diamond','Ullrich','Olson','Archibald.Robel97@yahoo.com','$2b$10$/J32pk98aAp38Aa2ANQkMek.Pod1MJXxNt99gFRBu5MnuOXzeDD0y',2846103,NULL,'2025-05-07 15:32:14.157','defaultpfp.png'),(42,1644064493,'Violette','Guido','Schaden','Mosciski','Citlalli27@gmail.com','$2b$10$VyT1KW2FrxfHG3N3Fi1sCeU3ybubrMjhyRX5jpIknkhYcf7DVrAVS',2846103,NULL,'2025-05-07 15:34:36.194','defaultpfp.png'),(43,1006996320,'Kurt','Madilyn','Dach','O\'Reilly','Dillon.Spencer39@gmail.com','$2b$10$g2m/GBle7NCigaKbIaUy1uwlVG4SWzUk62KrGcibLptVrikofsVwG',2846103,NULL,'2025-05-07 15:34:37.101','defaultpfp.png'),(44,1721896239,'Aric','Citlalli','Wiza','Bradtke','Danielle_Davis71@yahoo.com','$2b$10$aTOJAqrvzAzk3VKIgmU6wOQ3Cpl9L5rj7eVxHmNpxjPGo0C2qAw.S',2846103,NULL,'2025-05-07 15:34:37.974','defaultpfp.png'),(45,1473829285,'Freida','Dallas','Wisozk','Kessler','Annie.Dooley@hotmail.com','$2b$10$ZlK7hPRW9xHWf9pZSWkO3eJmq2KDxBFovuSyGAnrexUTuhmTzBFb.',2846103,NULL,'2025-05-07 15:34:38.898','defaultpfp.png'),(46,1045543223,'Vickie','Joe','Keebler','Mohr','Alisha3@hotmail.com','$2b$10$D2TVWbTpqezB5fgvZFdodOepGz/C/eT84DfmvJifveY/7Xj/HXkHC',2846103,NULL,'2025-05-07 15:34:39.800','defaultpfp.png'),(47,1178791426,'Kayley','Marquis','Orn','Miller','Wyman_Nolan31@yahoo.com','$2b$10$SJ7fn7moOEYa4bXuaem4vecDtQXkoU/KreJiqSkxJdkx9g1sSr/t2',2846103,NULL,'2025-05-07 15:34:40.598','defaultpfp.png'),(48,1406375130,'Ahmed','Oswaldo','Ratke','Bosco','Marjorie13@gmail.com','$2b$10$MGsDiXJO8vxaQH5blnZU3.vysbLUsduwE6vcTK.u4rYKtHfwRKv4W',2846103,NULL,'2025-05-07 15:34:41.435','defaultpfp.png'),(49,2061593023,'Paula','Daphnee','Nienow','Turcotte','Destiney_Cartwright83@yahoo.com','$2b$10$Im4oMoRWQydU5/W0A4n0weTZJcpeIV5Gsrn4wccReDctdwTMtISGa',2846103,NULL,'2025-05-07 15:34:44.630','defaultpfp.png'),(50,1006969908,'Kay','Dessie','Wehner','Wehner','Ebony.Williamson81@gmail.com','$2b$10$qaq4/hhHRr.UPqVGthEzh.Xtz0CLmo5TyOkY9fXvXM8Hl2HXYQdAi',2846103,NULL,'2025-05-07 15:34:46.609','defaultpfp.png'),(51,1744156629,'Claire','Lula','Batz','Nolan','Freeman71@hotmail.com','$2b$10$dCIOwCvVwJq.bTtIqwA6nOTxKKqC0SCPJCzCGbBQOZaCQh9eBf7sG',2846103,NULL,'2025-05-07 15:38:02.183','defaultpfp.png'),(56,1000000000,'Usuario','','Prueba','','usuario@gmail.com','$2b$10$KtMyY3GqlyaCVpwq99Szc.z6nuNmr52YtRSccpPJJuZ0vyhZkVLY6',2846103,NULL,'2005-02-06 00:00:00.000','img-1748269009476-535120811.png');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-28  8:32:25
