using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;

namespace TeamTrack.API.Swagger
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var formFileProps = context.ApiDescription.ParameterDescriptions
                .Select(p => p.Type)
                .Where(t =>
                    t == typeof(IFormFile) ||
                    (t.IsClass && t.GetProperties().Any(prop => prop.PropertyType == typeof(IFormFile))))
                .ToList();

            if (!formFileProps.Any()) return;

            operation.Parameters.Clear();

            var properties = new Dictionary<string, OpenApiSchema>();

            foreach (var type in formFileProps)
            {
                if (type == typeof(IFormFile))
                {
                    properties["file"] = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary"
                    };
                }
                else
                {
                    var fileProps = type.GetProperties()
                        .Where(p => p.PropertyType == typeof(IFormFile));

                    foreach (var prop in fileProps)
                    {
                        properties[prop.Name] = new OpenApiSchema
                        {
                            Type = "string",
                            Format = "binary"
                        };
                    }
                }
            }

            operation.RequestBody = new OpenApiRequestBody
            {
                Content =
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = properties,
                            Required = new HashSet<string>(properties.Keys)
                        }
                    }
                }
            };
        }
    }
}
