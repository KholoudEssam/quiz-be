/**
 * @swagger
 *
 * /login:
 *   post:
 *     description:
 *       -users have to login to access all resources
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 */

///////////////////////////////////////////////

/**
 * @swagger
 *
 * /users/{userId}:
 *   get:
 *     description:
 *      -Returns a user by ID.
 *     parameters:
 *      -in: path
 *       required: true
 *       name: userId
 *       type: string
 *
 */
