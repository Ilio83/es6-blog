var data = [
    { author: "Ilio", text: "Ciao" },
    { author: "Jordan Walke", text: "Questo è un *altro* commento" }
];

class CommentBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: [] }
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }

    handleCommentSubmit(comment) {


        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: (data) => {
                this.setState({data});
            },
            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        })

    }

    componentDidMount() {

        var loadCommentsFromServer = () => {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                cache: false,
                success: (data) => {
                    this.setState({data});
                },
                error: (xhr, status, err) => {
                    console.error(this.props.url, status, err.toString());
                }
            });
        }


        loadCommentsFromServer();
        setInterval(loadCommentsFromServer, this.props.pollInterval);
    }

    render() {
        return (
            <div className="CommentBox">
                <h1>Commenti</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
};

class Comment extends React.Component {
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                {this.props.children}
            </div>
        );
    }
};

class CommentList extends React.Component {
    render() {
        var commentNodes = this.props.data.map((comment) => {
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });

        return (
            <div className="CommentList">
                {commentNodes}
            </div>
        );
    };
}

class CommentForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);//dobbiamo bindare questo this per evitare che il this di findDOMNode si riferisca ad handleSubmit, cosa che non vogliamo per il solito problema di this in Js//
    }

    handleSubmit(e) {
        e.preventDefault();
        var author = ReactDOM.findDOMNode(this.refs.author).value.trim();
        var text = ReactDOM.findDOMNode(this.refs.text).value.trim();
        console.log("ricevuto" + author + text)
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({ author, text });
        ReactDOM.findDOMNode(this.refs.author).value = '';
        ReactDOM.findDOMNode(this.refs.text).value = '';
        return;
    }

    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Il tuo nome" ref="author" />
                <input type="text" placeholder="Di' qualcosa..." ref="text" />
                <input type="submit" value="Invia" />
            </form>
        );
    }
};

ReactDOM.render(
    <CommentBox url='api/comments' pollInterval={2000} />,
    document.getElementById('content')
);