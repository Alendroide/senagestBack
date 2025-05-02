import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';

@Injectable()
export class PermisosService {
    
    constructor(private prismaService : PrismaService){}

    async getPermisosCategorized () {
        const permisos = await this.prismaService.modulo.findMany({
            select : {
                id : true,
                nombre : true,
                icono : true,
                permisos : true
            }
        })
        return permisos;
    }

    async getPermisosByModulo ( moduloId : number ) {
        const permisos = await this.prismaService.permiso.findMany({
            where : {
                moduloId
            }
        })
        return permisos;
    }

    async createPermiso (data : CreatePermisoDto) {
        const permisoInfo = {
            nombre : data.nombre,
            descripcion : data.descripcion,
            tipo : data.tipo,
            moduloId : data.moduloId
        }
        
        const permiso = await this.prismaService.permiso.create({
            data : permisoInfo
        });

        await this.prismaService.rutaFront.create({
            data : {
                nombre : data.rutaNombre,
                ruta : data.rutaRuta,
                permisoId : permiso.id
            }
        });
        
        return { message : "Permiso created successfully", permiso };
    }

    async asignPermiso (permisoId : number, rolId : number, valor : boolean) {

        const [existingPermiso] = await this.prismaService.rolPermiso.findMany({
            where : {
                rolId,
                permisoId
            }
        })

        if(!existingPermiso){
            const newAsign = await this.prismaService.rolPermiso.create({
                data : {
                    permisoId,
                    rolId,
                    valor
                }
            });
            return { message : "Permiso asigned successfully", value : newAsign};
        }
        else{
            const updatedAsign = await this.prismaService.rolPermiso.updateMany({
                data : {valor},
                where : {
                    rolId,
                    permisoId
                }
            })
            return { message : "Permiso asigned successfully", value : updatedAsign};
        }

    }

    async myPermisos (usuarioId : number) {
        const myPermisos = await this.prismaService.rolPermiso.findMany({
            where : {
                rol : {
                    usuarios : {
                        some : {
                            id : usuarioId
                        }
                    }
                }
            },
            select : {
                permiso : {
                    select : {
                        nombre : true,
                        modulo : {
                            select : {
                                nombre : true
                            }
                        }
                    }
                }
            }
        })
        const permisosName = myPermisos.map(pem => ({
            nombre : pem.permiso.nombre,
            modulo : pem.permiso.modulo.nombre
        }))
        return permisosName;
    }

    async myPermisosByModulo (usuarioId : number, moduloId : number) {
        const myPermisos = await this.prismaService.rolPermiso.findMany({
            where : {
                rol : {
                    usuarios : {
                        some : {
                            id : usuarioId
                        }
                    }
                },
                permiso : {
                    modulo : {
                        id : moduloId
                    }
                }
            },
            select : {
                permiso : {
                    select : {
                        nombre : true,
                        modulo : {
                            select : {
                                nombre : true
                            }
                        }
                    }
                }
            }
        })
        const permisosName = myPermisos.map(pem => ({
            nombre : pem.permiso.nombre,
            modulo : pem.permiso.modulo.nombre
        }))
        return permisosName;
    }
}
