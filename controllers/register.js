const handleRegister = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('Incorrect form submition');
	}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginemail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginemail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Unable to join! User already exists.'))
};

module.exports = {
	handleRegister: handleRegister
};